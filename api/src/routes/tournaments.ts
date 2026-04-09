import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { createNotification } from '../utils/notifications';
import { assertValidTransition } from '../utils/tournamentFsm';
import { submitResults, getResults, AppError } from '../services/tournament.service';
import { generateParticipationCertificate } from '../services/pdf.service';
import { debounceScheduleEmail } from '../lib/scheduleQueue';
import { enqueueEmail } from '../lib/emailQueue';
import { validateAndUpload, UploadValidationError } from '../services/storage.service';
import prisma from '../lib/prisma';

// Accept up to 10MB at the multer layer; fine-grained validation handled inside validateAndUpload()
const photoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

// GET /api/tournaments — list published tournaments
router.get('/tournaments', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      status: { not: 'DRAFT' },
    };

    const VALID_STATUSES = ['DRAFT', 'PUBLISHED', 'REGISTRATION_OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (req.query.status) {
      if (!VALID_STATUSES.includes(req.query.status as string)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
      }
      where.status = req.query.status as string;
    }
    if (req.query.country) where.country = { contains: req.query.country as string, mode: 'insensitive' };
    if (req.query.city) where.city = { contains: req.query.city as string, mode: 'insensitive' };

    // Date range filter: ?startFrom= and ?startTo= (ISO date YYYY-MM-DD)
    if (req.query.startFrom || req.query.startTo) {
      const dateFilter: Record<string, Date> = {};
      if (req.query.startFrom) {
        const d = new Date(req.query.startFrom as string);
        if (!isNaN(d.getTime())) dateFilter.gte = d;
      }
      if (req.query.startTo) {
        const d = new Date(req.query.startTo as string);
        if (!isNaN(d.getTime())) dateFilter.lte = d;
      }
      if (Object.keys(dateFilter).length > 0) where.startDate = dateFilter;
    }

    // Full-text search: ?q= matches title or description (case-insensitive)
    if (req.query.q) {
      const q = req.query.q as string;
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Rating limit filter: show tournaments where ratingLimit <= ratingMax (or ratingLimit is null = Open)
    if (req.query.ratingMax) {
      const ratingMax = parseInt(req.query.ratingMax as string);
      if (!isNaN(ratingMax)) {
        // Combine with existing OR (from ?q=) using AND if needed
        const ratingOr = [
          { ratingLimit: { lte: ratingMax } },
          { ratingLimit: null },
        ];
        if (where.OR) {
          where.AND = [{ OR: where.OR }, { OR: ratingOr }];
          delete where.OR;
        } else {
          where.OR = ratingOr;
        }
      }
    }

    // Time control filter (exact match: classical, rapid, blitz)
    if (req.query.timeControl) {
      where.timeControl = (req.query.timeControl as string).toLowerCase();
    }

    // Price filter: ?feeMax=0 → free only; ?feeMin=X and/or ?feeMax=Y → range
    if (req.query.feeMax !== undefined || req.query.feeMin !== undefined) {
      const feeFilter: Record<string, number> = {};
      if (req.query.feeMax !== undefined) {
        const feeMax = parseFloat(req.query.feeMax as string);
        if (!isNaN(feeMax)) feeFilter.lte = feeMax;
      }
      if (req.query.feeMin !== undefined) {
        const feeMin = parseFloat(req.query.feeMin as string);
        if (!isNaN(feeMin)) feeFilter.gte = feeMin;
      }
      if (Object.keys(feeFilter).length > 0) where.fee = feeFilter;
    }

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          commissioner: {
            select: {
              id: true,
              userId: true,
              country: true,
              city: true,
              user: { select: { name: true, surname: true } },
            },
          },
          _count: { select: { registrations: true } },
        },
      }),
      prisma.tournament.count({ where }),
    ]);

    res.json({
      data: tournaments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('List tournaments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tournaments/:id — single tournament (with registration count + user's own registration)
router.get('/tournaments/:id', async (req: Request, res: Response) => {
  try {
    // Extract user from token if present (optional auth)
    let userId: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const { verifyToken } = await import('../utils/jwt');
        const payload = verifyToken(authHeader.split(' ')[1]);
        if (payload.type === 'access') userId = payload.userId;
      } catch {
        // Invalid token — continue as anonymous
      }
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: {
        commissioner: {
          select: {
            id: true,
            userId: true,
            country: true,
            city: true,
            photoUrl: true,
            user: { select: { name: true, surname: true } },
          },
        },
        _count: {
          select: { registrations: true },
        },
        registrations: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, surname: true, country: true } },
            payment: { select: { status: true } },
          },
        },
        results: {
          orderBy: { place: 'asc' },
          include: {
            user: { select: { id: true, name: true, surname: true, country: true } },
          },
        },
      },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    // Fetch user's own registration if logged in
    let myRegistration = null;
    if (userId) {
      myRegistration = await prisma.tournamentRegistration.findUnique({
        where: {
          tournamentId_userId: {
            tournamentId: tournament.id,
            userId,
          },
        },
        select: { id: true, status: true, createdAt: true },
      });
    }

    // Shape participants and results for frontend consumption
    const participants = tournament.registrations.map((r) => ({
      id: r.id,
      user: r.user,
      paid: r.payment?.status === 'PAID',
      registeredAt: r.createdAt,
    }));

    const results = tournament.results.map((r) => ({
      id: r.id,
      rank: r.place,
      player: r.user,
      score: r.score,
      ratingChange: r.eloChange,
    }));

    // Exclude raw registrations and results from spread to prevent PII leak
    const { registrations: _reg, results: _res, ...tournamentData } = tournament;
    res.json({
      ...tournamentData,
      registrationCount: tournament._count.registrations,
      participants,
      results,
      myRegistration,
    });
  } catch (err) {
    console.error('Get tournament error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Helper: get Commissioner record for current user ───
async function getCommissioner(userId: string) {
  return prisma.commissioner.findUnique({ where: { userId } });
}

// ─── Helper: check commissioner is verified (skip for ADMIN) ───
function assertCommissionerVerified(
  commissioner: { isVerified: boolean } | null,
  role: string,
  res: Response,
): boolean {
  if (role === 'ADMIN') return true;
  if (!commissioner || !commissioner.isVerified) {
    res.status(403).json({ error: 'Commissioner account not verified yet' });
    return false;
  }
  return true;
}

// POST /api/tournaments — create tournament (Commissioner/Admin only)
router.post('/tournaments', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const commissioner = await getCommissioner(userId);

    if (!commissioner) {
      res.status(400).json({ error: 'Complete your commissioner profile first' });
      return;
    }

    if (!assertCommissionerVerified(commissioner, role, res)) return;

    const { title, city, country, startDate, endDate, maxParticipants, fee, description, ratingLimit, timeControl, currency } = req.body;

    if (!title || !startDate || !endDate) {
      res.status(400).json({ error: 'title, startDate, and endDate are required' });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }
    if (end <= start) {
      res.status(400).json({ error: 'endDate must be after startDate' });
      return;
    }

    const tournament = await prisma.tournament.create({
      data: {
        title: title.trim(),
        city: city?.trim() || '',
        country: country?.trim() || '',
        startDate: start,
        endDate: end,
        maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : null,
        fee: fee != null ? parseFloat(fee) : null,
        currency: currency?.trim() || 'USD',
        description: description?.trim() || null,
        ratingLimit: ratingLimit ? parseInt(ratingLimit, 10) : null,
        timeControl: timeControl?.trim()?.toLowerCase() || null,
        commissionerId: commissioner.id,
        status: 'DRAFT',
      },
      include: {
        commissioner: { select: { id: true, userId: true } },
      },
    });

    res.status(201).json(tournament);
  } catch (err) {
    console.error('Create tournament error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tournaments/:id — update tournament (owner Commissioner or Admin)
router.put('/tournaments/:id', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true, isVerified: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    // Only owner commissioner or admin can update
    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to edit this tournament' });
      return;
    }

    if (!assertCommissionerVerified(tournament.commissioner, role, res)) return;

    // Note: status is intentionally excluded — all status transitions must go through PATCH /:id/status
    const { title, city, country, startDate, endDate, maxParticipants, fee, description, ratingLimit, timeControl, currency } = req.body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title.trim();
    if (city !== undefined) data.city = city.trim();
    if (country !== undefined) data.country = country.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (ratingLimit !== undefined) data.ratingLimit = ratingLimit ? parseInt(ratingLimit, 10) : null;
    if (timeControl !== undefined) data.timeControl = timeControl?.trim()?.toLowerCase() || null;
    if (currency !== undefined) data.currency = currency?.trim() || 'USD';
    if (maxParticipants !== undefined) data.maxParticipants = maxParticipants ? parseInt(maxParticipants, 10) : null;
    if (fee !== undefined) data.fee = fee != null ? parseFloat(fee) : null;

    if (startDate !== undefined) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        res.status(400).json({ error: 'Invalid startDate format' });
        return;
      }
      data.startDate = start;
    }
    if (endDate !== undefined) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        res.status(400).json({ error: 'Invalid endDate format' });
        return;
      }
      data.endDate = end;
    }

    // Detect if any schedule-relevant field actually changed (compare old vs new values)
    const scheduleFields = ['startDate', 'endDate', 'title', 'city', 'country', 'fee'] as const;
    const scheduleChanged = scheduleFields.some((field) => {
      if (!(field in data)) return false;
      const newVal = field === 'startDate' || field === 'endDate'
        ? (data[field] as Date).getTime()
        : data[field];
      const oldVal = field === 'startDate' || field === 'endDate'
        ? (tournament[field] as Date).getTime()
        : tournament[field];
      return newVal !== oldVal;
    });

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data,
      include: {
        commissioner: { select: { id: true, userId: true } },
      },
    });

    // Debounce schedule-change email notification (fire-and-forget, non-fatal)
    if (scheduleChanged) {
      debounceScheduleEmail(req.params.id).catch((err) =>
        console.error('[tournaments] debounceScheduleEmail failed:', (err as Error).message),
      );
    }

    res.json(updated);
  } catch (err) {
    console.error('Update tournament error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/tournaments/:id/status — change tournament status
router.patch('/tournaments/:id/status', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: {
        commissioner: {
          select: {
            userId: true,
            isVerified: true,
            user: { select: { email: true } },
          },
        },
      },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    if (!assertCommissionerVerified(tournament.commissioner, role, res)) return;

    const { status: newStatus } = req.body;
    if (!newStatus) {
      res.status(400).json({ error: 'status is required' });
      return;
    }

    // FSM: validate tournament status transition
    const { valid, allowed } = assertValidTransition(tournament.status, newStatus);
    if (!valid) {
      res.status(400).json({
        error: `Invalid status transition: ${tournament.status} → ${newStatus}`,
        allowed,
      });
      return;
    }

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: { status: newStatus },
    });

    // ─── Cancellation side-effects ───────────────────────────────────────────
    if (newStatus === 'CANCELLED') {
      // Fetch affected registrations BEFORE updating their status
      const affectedRegistrations = await prisma.tournamentRegistration.findMany({
        where: {
          tournamentId: req.params.id,
          status: { in: ['APPROVED', 'PAID'] },
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });

      // Bulk-cancel all APPROVED/PAID registrations
      if (affectedRegistrations.length > 0) {
        await prisma.tournamentRegistration.updateMany({
          where: {
            tournamentId: req.params.id,
            status: { in: ['APPROVED', 'PAID'] },
          },
          data: { status: 'CANCELLED' },
        });

        // Fire-and-forget: email + in-app notification for each affected participant
        const commissionerEmail = tournament.commissioner.user.email;
        (async () => {
          for (const reg of affectedRegistrations) {
            try {
              await enqueueEmail('tournament_cancelled', reg.user.email, {
                userName: reg.user.name ?? reg.user.email,
                tournamentTitle: tournament.title,
                commissionerEmail,
              });
            } catch (e) {
              console.error(`[cancel] enqueueEmail tournament_cancelled failed for ${reg.user.email}:`, (e as Error).message);
            }

            try {
              await createNotification(
                reg.user.id,
                'TOURNAMENT_CANCELLED',
                'Tournament cancelled',
                `The tournament "${tournament.title}" has been cancelled. Contact the commissioner for refund details.`,
                { tournamentId: req.params.id },
              );
            } catch (e) {
              console.error(`[cancel] createNotification failed for ${reg.user.id}:`, (e as Error).message);
            }
          }
        })().catch((err) =>
          console.error('[cancel] side-effect loop failed:', (err as Error).message),
        );
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    res.json(updated);
  } catch (err) {
    console.error('Update tournament status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tournaments/:id — delete tournament (owner Commissioner or Admin)
router.delete('/tournaments/:id', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true, isVerified: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this tournament' });
      return;
    }

    if (!assertCommissionerVerified(tournament.commissioner, role, res)) return;

    if (['COMPLETED', 'IN_PROGRESS'].includes(tournament.status)) {
      res.status(400).json({ error: 'Cannot delete a tournament that is in progress or completed' });
      return;
    }

    await prisma.tournament.delete({ where: { id: req.params.id } });
    res.json({ message: 'Tournament deleted' });
  } catch (err) {
    console.error('Delete tournament error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Multi-Commissioner Endpoints ───────────────────────

// Helper: get LEAD userId from TournamentCommissioner table (with legacy commissionerId fallback)
async function getTournamentLeadUserId(tournamentId: string): Promise<string | null> {
  const lead = await prisma.tournamentCommissioner.findFirst({
    where: { tournamentId, role: 'LEAD' },
    select: { userId: true },
  });
  if (lead?.userId) return lead.userId;

  // Fallback: legacy commissionerId field for older tournaments
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { commissionerId: true },
  });
  return tournament?.commissionerId ?? null;
}

// Helper: check if user is LEAD commissioner or ADMIN (with legacy commissionerId fallback)
async function isLeadOrAdmin(tournamentId: string, userId: string, role: string): Promise<boolean> {
  if (role === 'ADMIN') return true;
  const leadUserId = await getTournamentLeadUserId(tournamentId);
  if (leadUserId === userId) return true;

  // Additional fallback: check legacy commissionerId directly
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { commissionerId: true },
  });
  return tournament?.commissionerId === userId;
}

// GET /api/tournaments/:id/commissioners — list all commissioners (public)
router.get('/tournaments/:id/commissioners', async (req: AuthRequest, res: Response) => {
  try {
    const tournamentId = req.params.id;
    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    const commissioners = await prisma.tournamentCommissioner.findMany({
      where: { tournamentId },
      include: {
        user: { select: { id: true, name: true, surname: true, email: true } },
      },
      orderBy: [{ role: 'asc' }, { assignedAt: 'asc' }],
    });

    res.json(commissioners);
  } catch (err) {
    console.error('List commissioners error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tournaments/:id/commissioners — add commissioner (LEAD or ADMIN only)
router.post('/tournaments/:id/commissioners', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournamentId = req.params.id;

    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (!(await isLeadOrAdmin(tournamentId, userId, role))) {
      res.status(403).json({ error: 'Only the lead commissioner or admin can manage commissioners' });
      return;
    }

    const { userId: targetUserId, role: commRole } = req.body as { userId?: string; role?: string };
    if (!targetUserId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    if (!commRole || !['LEAD', 'ASSISTANT'].includes(commRole)) {
      res.status(400).json({ error: 'role must be LEAD or ASSISTANT' });
      return;
    }

    // Ensure target user exists
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Only one LEAD allowed per tournament
    if (commRole === 'LEAD') {
      const existingLead = await prisma.tournamentCommissioner.findFirst({
        where: { tournamentId, role: 'LEAD' },
      });
      if (existingLead && existingLead.userId !== targetUserId) {
        res.status(409).json({ error: 'A lead commissioner already exists for this tournament' });
        return;
      }
    }

    try {
      const entry = await prisma.tournamentCommissioner.create({
        data: {
          tournamentId,
          userId: targetUserId,
          role: commRole as 'LEAD' | 'ASSISTANT',
        },
        include: {
          user: { select: { id: true, name: true, surname: true, email: true } },
        },
      });
      res.status(201).json(entry);
    } catch (createErr: unknown) {
      const prismaErr = createErr as { code?: string };
      if (prismaErr?.code === 'P2002') {
        res.status(409).json({ error: 'This user is already assigned as a commissioner for this tournament' });
        return;
      }
      throw createErr;
    }
  } catch (err) {
    console.error('Add commissioner error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tournaments/:id/commissioners/:targetUserId — remove commissioner (LEAD or ADMIN only)
router.delete('/tournaments/:id/commissioners/:targetUserId', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const { id: tournamentId, targetUserId } = req.params;

    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (!(await isLeadOrAdmin(tournamentId, userId, role))) {
      res.status(403).json({ error: 'Only the lead commissioner or admin can manage commissioners' });
      return;
    }

    const entry = await prisma.tournamentCommissioner.findFirst({
      where: { tournamentId, userId: targetUserId },
    });
    if (!entry) {
      res.status(404).json({ error: 'Commissioner assignment not found' });
      return;
    }

    // LEAD cannot remove themselves via this endpoint
    if (entry.role === 'LEAD' && role !== 'ADMIN') {
      res.status(403).json({ error: 'Lead commissioner cannot be removed by another commissioner; contact admin' });
      return;
    }

    await prisma.tournamentCommissioner.delete({ where: { id: entry.id } });
    res.status(204).send();
  } catch (err) {
    console.error('Remove commissioner error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Results Endpoints ──────────────────────────────────

// POST /api/tournaments/:id/results — submit results (Commissioner/Admin only)
router.post('/tournaments/:id/results', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true, isVerified: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to submit results for this tournament' });
      return;
    }

    if (!assertCommissionerVerified(tournament.commissioner, role, res)) return;

    const { results } = req.body;
    if (!Array.isArray(results) || results.length === 0) {
      res.status(400).json({ error: 'results must be a non-empty array of { userId, place, score }' });
      return;
    }

    // Validate each entry
    for (const entry of results) {
      if (!entry.userId || typeof entry.place !== 'number' || typeof entry.score !== 'number') {
        res.status(400).json({ error: 'Each result must have userId (string), place (number), score (number)' });
        return;
      }
      if (entry.place < 1 || !Number.isInteger(entry.place)) {
        res.status(400).json({ error: 'place must be a positive integer' });
        return;
      }
    }

    const data = await submitResults(req.params.id, results);
    res.status(201).json(data);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    console.error('Submit results error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tournaments/:id/results — get results (public, only COMPLETED)
router.get('/tournaments/:id/results', async (req: Request, res: Response) => {
  try {
    const data = await getResults(req.params.id);
    res.json(data);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    console.error('Get results error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Registration Endpoints ──────────────────────────────

const REGISTRABLE_STATUSES = ['PUBLISHED', 'REGISTRATION_OPEN'];

// POST /api/tournaments/:id/register — apply to tournament
router.post('/tournaments/:id/register', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const tournamentId = req.params.id;
    const userId = req.user!.userId;

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        _count: { select: { registrations: true } },
        commissioner: { select: { userId: true } },
      },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (!REGISTRABLE_STATUSES.includes(tournament.status)) {
      res.status(400).json({ error: 'Tournament is not open for registration' });
      return;
    }

    if (tournament.maxParticipants && tournament._count.registrations >= tournament.maxParticipants) {
      res.status(400).json({ error: 'Tournament is full' });
      return;
    }

    // Check rating limit
    if (tournament.ratingLimit) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.rating > tournament.ratingLimit) {
        res.status(400).json({ error: `Your rating exceeds the limit of ${tournament.ratingLimit}` });
        return;
      }
    }

    // Check duplicate
    const existing = await prisma.tournamentRegistration.findUnique({
      where: { tournamentId_userId: { tournamentId, userId } },
    });

    if (existing) {
      res.status(409).json({ error: 'Already registered for this tournament' });
      return;
    }

    const isFree = (tournament.fee ?? 0) === 0;

    let registration: { id: string; status: string; createdAt: Date };

    if (isFree) {
      // Free tournament: create registration + payment in one transaction, set both to PAID
      const result = await prisma.$transaction(async (tx) => {
        const reg = await tx.tournamentRegistration.create({
          data: { tournamentId, userId, status: 'PAID' },
          select: { id: true, status: true, createdAt: true },
        });

        const payment = await tx.payment.create({
          data: {
            userId,
            tournamentId,
            amount: 0,
            currency: tournament.currency,
            status: 'PAID',
          },
        });

        await tx.tournamentRegistration.update({
          where: { id: reg.id },
          data: { paymentId: payment.id },
        });

        return reg;
      });

      registration = result;

      // Fire-and-forget thank-you email after transaction commit (via queue with retry)
      (async () => {
        try {
          const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
          if (user) {
            await enqueueEmail('thank_you', user.email, {
              userName: user.name ?? user.email,
              tournamentName: tournament.title,
            });
          }
        } catch (e) {
          console.error('enqueueEmail thank_you error (free registration):', e);
        }
      })();
    } else {
      // Paid tournament: registration starts as APPROVED so payment can be initiated immediately
      registration = await prisma.tournamentRegistration.create({
        data: { tournamentId, userId, status: 'APPROVED' },
        select: { id: true, status: true, createdAt: true },
      });
    }

    res.status(201).json(registration);

    // Fire-and-forget: notify commissioner about new registration
    (async () => {
      try {
        const commissionerUserId = tournament.commissioner?.userId;
        if (commissionerUserId) {
          const participant = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
          const participantName = participant?.name ?? participant?.email ?? 'Unknown';
          await createNotification(
            commissionerUserId,
            'NEW_REGISTRATION',
            'New registration',
            `New registration: ${participantName} has registered for "${tournament.title}".`,
            { tournamentId, registrationId: registration.id },
          );
        }
      } catch (e) {
        console.error('createNotification (new registration) error:', e);
      }
    })();
  } catch (err) {
    console.error('Tournament register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/my-registrations — participant's own registrations
router.get('/my-registrations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const registrations = await prisma.tournamentRegistration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        tournament: {
          select: {
            id: true,
            title: true,
            city: true,
            country: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    res.json(registrations);
  } catch (err) {
    console.error('My registrations error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tournaments/:id/registrations — list registrations (Commissioner/Admin)
router.get('/tournaments/:id/registrations', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true, isVerified: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    if (!assertCommissionerVerified(tournament.commissioner, role, res)) return;

    const registrations = await prisma.tournamentRegistration.findMany({
      where: { tournamentId: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true, rating: true, city: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(registrations);
  } catch (err) {
    console.error('List registrations error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tournaments/:id/registrations/:regId — update registration status (APPROVED/REJECTED)
router.put('/tournaments/:id/registrations/:regId', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true, isVerified: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    if (!assertCommissionerVerified(tournament.commissioner, role, res)) return;

    const { status } = req.body;
    if (!status || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      res.status(400).json({ error: 'status must be APPROVED, REJECTED, or PENDING' });
      return;
    }

    const registration = await prisma.tournamentRegistration.findFirst({
      where: { id: req.params.regId, tournamentId: req.params.id },
      include: { payment: true },
    });

    if (!registration) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }

    const isFree = (tournament.fee ?? 0) === 0;

    // For free tournaments: APPROVED → auto-upgrade to PAID (skip Stripe)
    const effectiveStatus = (status === 'APPROVED' && isFree) ? 'PAID' : status;

    let updated;

    if (effectiveStatus === 'PAID' && isFree) {
      // Free tournament approve: set status PAID and ensure Payment record exists
      updated = await prisma.$transaction(async (tx) => {
        if (!registration.payment) {
          // No payment yet — create one
          const payment = await tx.payment.create({
            data: {
              userId: registration.userId,
              tournamentId: tournament.id,
              amount: 0,
              currency: tournament.currency,
              status: 'PAID',
            },
          });
          return tx.tournamentRegistration.update({
            where: { id: req.params.regId },
            data: { status: 'PAID', paymentId: payment.id },
            include: {
              user: { select: { id: true, name: true, email: true, rating: true, city: true } },
            },
          });
        } else if (registration.payment.status !== 'PAID') {
          // Payment exists but not yet PAID — update it
          await tx.payment.update({
            where: { id: registration.payment.id },
            data: { status: 'PAID' },
          });
        }
        return tx.tournamentRegistration.update({
          where: { id: req.params.regId },
          data: { status: 'PAID' },
          include: {
            user: { select: { id: true, name: true, email: true, rating: true, city: true } },
          },
        });
      });
    } else {
      updated = await prisma.tournamentRegistration.update({
        where: { id: req.params.regId },
        data: { status: effectiveStatus },
        include: {
          user: { select: { id: true, name: true, email: true, rating: true, city: true } },
        },
      });
    }

    // Send in-app notification when registration is approved/paid or rejected
    if (status === 'APPROVED') {
      await createNotification(
        registration.userId,
        'REGISTRATION_APPROVED',
        'Заявка одобрена',
        `Ваша заявка на турнир "${tournament.title}" одобрена. Вы приняты!`,
        { tournamentId: tournament.id, registrationId: registration.id },
      );
    } else if (status === 'REJECTED') {
      await createNotification(
        registration.userId,
        'REGISTRATION_REJECTED',
        'Заявка отклонена',
        `Ваша заявка на турнир "${tournament.title}" была отклонена.`,
        { tournamentId: tournament.id, registrationId: registration.id },
      );
    }

    res.json(updated);
  } catch (err) {
    console.error('Update registration status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tournaments/:id/photos — list photos (public)
router.get('/tournaments/:id/photos', async (req: Request, res: Response) => {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    const photos = await prisma.tournamentPhoto.findMany({
      where: { tournamentId: req.params.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        url: true,
        caption: true,
        createdAt: true,
        uploader: { select: { id: true, name: true } },
      },
    });

    res.json(photos);
  } catch (err) {
    console.error('List photos error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tournaments/:id/photos — add photo (Commissioner who owns tournament / Admin)
router.post('/tournaments/:id/photos', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true, isVerified: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    if (!assertCommissionerVerified(tournament.commissioner, role, res)) return;

    const { url, caption } = req.body;

    if (!url || typeof url !== 'string' || url.trim() === '') {
      res.status(400).json({ error: 'url is required' });
      return;
    }

    // Validate URL format
    try {
      const parsed = new URL(url.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        res.status(400).json({ error: 'url must use http or https' });
        return;
      }
    } catch {
      res.status(400).json({ error: 'Invalid url format' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check photo limit (UC-09: max 10 photos per tournament)
    const photoCount = await prisma.tournamentPhoto.count({
      where: { tournamentId: req.params.id },
    });
    if (photoCount >= 10) {
      res.status(400).json({ error: 'Maximum 10 photos allowed per tournament' });
      return;
    }

    const photo = await prisma.tournamentPhoto.create({
      data: {
        tournamentId: req.params.id,
        url: url.trim(),
        caption: caption ? String(caption).trim() || null : null,
        uploadedBy: userId,
      },
      select: {
        id: true,
        url: true,
        caption: true,
        createdAt: true,
        uploader: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(photo);
  } catch (err) {
    console.error('Add photo error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tournaments/:id/photos/upload — upload photo file via multipart (Commissioner/Admin)
// MUST be declared BEFORE DELETE /:id/photos/:photoId to avoid route conflict
router.post('/tournaments/:id/photos/upload', authenticate, requireRole('COMMISSIONER', 'ADMIN'), (req: AuthRequest, res: Response) => {
  photoUpload.single('photo')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File too large. Maximum size is 10MB' });
        return;
      }
      res.status(400).json({ error: err.message });
      return;
    } else if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded. Use field name "photo"' });
        return;
      }

      const { userId, role } = req.user!;
      const tournament = await prisma.tournament.findUnique({
        where: { id: req.params.id },
        include: { commissioner: { select: { userId: true, isVerified: true } } },
      });

      if (!tournament) {
        res.status(404).json({ error: 'Tournament not found' });
        return;
      }

      if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      if (!assertCommissionerVerified(tournament.commissioner, role, res)) return;

      const photoCount = await prisma.tournamentPhoto.count({
        where: { tournamentId: req.params.id },
      });
      if (photoCount >= 10) {
        res.status(400).json({ error: 'Maximum 10 photos allowed per tournament' });
        return;
      }

      const url = await validateAndUpload(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname,
        'tournament-photo',
      );

      res.status(201).json({ url });
    } catch (uploadErr: any) {
      if (uploadErr instanceof UploadValidationError) {
        res.status(400).json({ error: uploadErr.message });
        return;
      }
      console.error('Tournament photo upload error:', uploadErr);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// DELETE /api/tournaments/:id/photos/:photoId — remove photo (Commissioner who owns tournament / Admin)
router.delete('/tournaments/:id/photos/:photoId', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true, isVerified: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    if (!assertCommissionerVerified(tournament.commissioner, role, res)) return;

    const photo = await prisma.tournamentPhoto.findFirst({
      where: { id: req.params.photoId, tournamentId: req.params.id },
    });

    if (!photo) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    await prisma.tournamentPhoto.delete({ where: { id: req.params.photoId } });

    res.status(204).send();
  } catch (err) {
    console.error('Delete photo error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/tournaments/:id/participants/:userId/confirm-cash — commissioner confirms cash payment
router.patch('/tournaments/:id/participants/:userId/confirm-cash', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId: commissionerUserId, role } = req.user!;
    const { id: tournamentId, userId: participantUserId } = req.params;

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { commissioner: { select: { userId: true, isVerified: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    // Only tournament owner commissioner (or admin) can confirm cash payments
    if (role !== 'ADMIN' && tournament.commissioner.userId !== commissionerUserId) {
      res.status(403).json({ error: 'Only the tournament commissioner can confirm cash payments' });
      return;
    }

    if (!assertCommissionerVerified(tournament.commissioner, role, res)) return;

    if (!['REGISTRATION_OPEN', 'IN_PROGRESS'].includes(tournament.status)) {
      res.status(400).json({ error: 'Tournament must be in REGISTRATION_OPEN or IN_PROGRESS status' });
      return;
    }

    // Find the registration for this participant
    const registration = await prisma.tournamentRegistration.findUnique({
      where: { tournamentId_userId: { tournamentId, userId: participantUserId } },
      include: { payment: true },
    });

    if (!registration) {
      res.status(404).json({ error: 'Participant not registered for this tournament' });
      return;
    }

    if (registration.payment) {
      // Payment record exists — update it if not already PAID
      if (registration.payment.status === 'PAID') {
        res.status(400).json({ error: 'Payment is already confirmed' });
        return;
      }

      await prisma.payment.update({
        where: { id: registration.payment.id },
        data: { status: 'PAID' },
      });
    } else {
      // No payment record yet — create one and link it to the registration
      const newPayment = await prisma.payment.create({
        data: {
          userId: participantUserId,
          tournamentId,
          amount: tournament.fee ?? 0,
          currency: tournament.currency,
          status: 'PAID',
        },
      });

      await prisma.tournamentRegistration.update({
        where: { id: registration.id },
        data: { paymentId: newPayment.id },
      });
    }

    // Notify participant (fire-and-forget)
    createNotification(
      participantUserId,
      'PAYMENT_CONFIRMED',
      'Оплата подтверждена',
      `Комиссар подтвердил вашу оплату наличными для турнира "${tournament.title}"`,
      { tournamentId },
    ).catch(() => {});

    res.json({ success: true, message: 'Cash payment confirmed' });
  } catch (err) {
    console.error('Confirm cash payment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tournaments/:id/my-certificate — download participation certificate PDF
router.get('/tournaments/:id/my-certificate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const { id: tournamentId } = req.params;

    // Load tournament with commissioner user
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        commissioner: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (tournament.status !== 'COMPLETED') {
      res.status(400).json({ error: 'Certificate is only available for completed tournaments' });
      return;
    }

    // Verify user has an APPROVED registration
    const registration = await prisma.tournamentRegistration.findUnique({
      where: { tournamentId_userId: { tournamentId, userId } },
    });

    if (!registration || !['APPROVED', 'PAID'].includes(registration.status)) {
      res.status(403).json({ error: 'You do not have an approved registration for this tournament' });
      return;
    }

    // Load user name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    // Load tournament result (optional — for place)
    const result = await prisma.tournamentResult.findUnique({
      where: { tournamentId_userId: { tournamentId, userId } },
    });

    const participantName = user?.name ?? user?.email ?? 'Participant';
    const commissionerName = tournament.commissioner.user.name ?? undefined;
    const tournamentDate = tournament.startDate
      ? new Date(tournament.startDate).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const pdfBuffer = await generateParticipationCertificate({
      participantName,
      tournamentName: tournament.title,
      tournamentDate,
      place: result?.place ?? undefined,
      commissionerName,
    });

    const safeTitle = tournament.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate_${safeTitle}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Certificate generation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Announcements ──────────────────────────────────────────

// POST /api/tournaments/:id/announcements — create announcement (commissioner only)
router.post('/tournaments/:id/announcements', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true } } },
    });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }
    if (tournament.commissioner.userId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Commissioner access required' });
      return;
    }
    const { title, body } = req.body;
    if (!title || !body) {
      res.status(400).json({ error: 'title and body are required' });
      return;
    }
    const ann = await prisma.announcement.create({
      data: { tournamentId: req.params.id, title: title.trim(), body: body.trim() },
    });
    res.status(201).json(ann);
  } catch (err) {
    console.error('Create announcement error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tournaments/:id/announcements — public sees published only, commissioner sees all
router.get('/tournaments/:id/announcements', async (req: Request, res: Response) => {
  try {
    let isCommissioner = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const { verifyToken } = await import('../utils/jwt');
        const payload = verifyToken(authHeader.split(' ')[1]);
        if (payload.type === 'access') {
          const tournament = await prisma.tournament.findUnique({
            where: { id: req.params.id },
            include: { commissioner: { select: { userId: true } } },
          });
          isCommissioner = tournament?.commissioner?.userId === payload.userId || payload.role === 'ADMIN';
        }
      } catch { /* not authenticated — show published only */ }
    }
    const anns = await prisma.announcement.findMany({
      where: {
        tournamentId: req.params.id,
        ...(isCommissioner ? {} : { published: true }),
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(anns);
  } catch (err) {
    console.error('List announcements error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/tournaments/:id/announcements/:annId/publish — publish + email participants
router.patch('/tournaments/:id/announcements/:annId/publish', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: {
        commissioner: { select: { userId: true } },
        registrations: {
          where: { status: { in: ['APPROVED', 'PAID'] } },
          include: { user: { select: { email: true } } },
        },
      },
    });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }
    if (tournament.commissioner.userId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Commissioner access required' });
      return;
    }
    const ann = await prisma.announcement.update({
      where: { id: req.params.annId },
      data: { published: true },
    });
    res.json(ann);

    // Fire-and-forget: enqueue announcement emails for each participant (with retry)
    (async () => {
      for (const reg of tournament.registrations) {
        if (reg.user?.email) {
          try {
            await enqueueEmail('announcement', reg.user.email, {
              tournamentTitle: tournament.title,
              announcementTitle: ann.title,
              body: ann.body,
            });
          } catch (e) {
            console.error(`[announcement] enqueueEmail failed for ${reg.user.email}:`, (e as Error).message);
          }
        }
      }
    })().catch((err) => console.error('Announcement email loop error:', (err as Error).message));
  } catch (err) {
    console.error('Publish announcement error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Schedule ──────────────────────────────────────────────

// GET /api/tournaments/:id/schedule — public, ordered by startTime asc
router.get('/tournaments/:id/schedule', async (req: Request, res: Response) => {
  try {
    const entries = await prisma.scheduleEntry.findMany({
      where: { tournamentId: req.params.id },
      orderBy: { startTime: 'asc' },
    });
    res.json(entries);
  } catch (err) {
    console.error('List schedule error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tournaments/:id/schedule — commissioner only
router.post('/tournaments/:id/schedule', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true } } },
    });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }
    if (tournament.commissioner.userId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Commissioner access required' });
      return;
    }
    const { title, startTime, endTime, description, venue, roundNumber } = req.body;
    if (!title || !startTime) {
      res.status(400).json({ error: 'title and startTime are required' });
      return;
    }
    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      res.status(400).json({ error: 'Invalid startTime format' });
      return;
    }
    const entry = await prisma.scheduleEntry.create({
      data: {
        tournamentId: req.params.id,
        title: title.trim(),
        startTime: start,
        endTime: endTime ? new Date(endTime) : undefined,
        description: description?.trim() || undefined,
        venue: venue?.trim() || undefined,
        roundNumber: roundNumber ? Number(roundNumber) : undefined,
      },
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error('Create schedule entry error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tournaments/:id/schedule/:entryId — commissioner only
router.delete('/tournaments/:id/schedule/:entryId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true } } },
    });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }
    if (tournament.commissioner.userId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Commissioner access required' });
      return;
    }
    await prisma.scheduleEntry.delete({ where: { id: req.params.entryId } });
    res.status(204).send();
  } catch (err) {
    console.error('Delete schedule entry error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── ROUNDS ───────────────────────────────────────────────

// GET /api/tournaments/:id/rounds — public, list rounds with pairings
router.get('/tournaments/:id/rounds', async (req: Request, res: Response) => {
  try {
    const rounds = await prisma.round.findMany({
      where: { tournamentId: req.params.id },
      orderBy: { roundNumber: 'asc' },
      include: {
        pairings: {
          orderBy: { board: 'asc' },
        },
      },
    });
    res.json(rounds);
  } catch (err) {
    console.error('List rounds error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tournaments/:id/rounds — commissioner only, create round
router.post('/tournaments/:id/rounds', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true } } },
    });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }
    if (role !== 'ADMIN' && tournament.commissioner?.userId !== userId) {
      res.status(403).json({ error: 'Commissioner access required' });
      return;
    }
    const { roundNumber } = req.body;
    if (!roundNumber) {
      res.status(400).json({ error: 'roundNumber required' });
      return;
    }
    const round = await prisma.round.create({
      data: { tournamentId: req.params.id, roundNumber: Number(roundNumber) },
    });
    res.status(201).json(round);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      res.status(409).json({ error: 'Round number already exists' });
      return;
    }
    console.error('Create round error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tournaments/:id/rounds/:roundId — commissioner only, update round status
router.put('/tournaments/:id/rounds/:roundId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true } } },
    });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }
    if (role !== 'ADMIN' && tournament.commissioner?.userId !== userId) {
      res.status(403).json({ error: 'Commissioner access required' });
      return;
    }
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: 'status required' });
      return;
    }
    const round = await prisma.round.update({
      where: { id: req.params.roundId },
      data: { status },
    });
    res.json(round);
  } catch (err) {
    console.error('Update round error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tournaments/:id/rounds/:roundId/pairings — commissioner only, bulk set pairings
router.post('/tournaments/:id/rounds/:roundId/pairings', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true } } },
    });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }
    if (role !== 'ADMIN' && tournament.commissioner?.userId !== userId) {
      res.status(403).json({ error: 'Commissioner access required' });
      return;
    }
    const pairings = req.body;
    if (!Array.isArray(pairings) || pairings.length === 0) {
      res.status(400).json({ error: 'pairings array required' });
      return;
    }
    const ops: import('@prisma/client').Prisma.PrismaPromise<unknown>[] = [
      prisma.pairing.deleteMany({ where: { roundId: req.params.roundId } }),
      ...pairings.map((p: any) => prisma.pairing.create({
        data: {
          roundId: req.params.roundId,
          player1Id: p.player1Id,
          player2Id: p.player2Id ?? null,
          board: p.board ? Number(p.board) : null,
        },
      })),
    ];
    await prisma.$transaction(ops);
    const updated = await prisma.pairing.findMany({
      where: { roundId: req.params.roundId },
      orderBy: { board: 'asc' },
    });
    res.json(updated);
  } catch (err) {
    console.error('Set pairings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/tournaments/:id/rounds/:roundId/pairings/:pairingId — commissioner only, set result
router.patch('/tournaments/:id/rounds/:roundId/pairings/:pairingId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { commissioner: { select: { userId: true } } },
    });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }
    if (role !== 'ADMIN' && tournament.commissioner?.userId !== userId) {
      res.status(403).json({ error: 'Commissioner access required' });
      return;
    }
    const validResults = ['1-0', '0-1', '0.5-0.5', null];
    const { result } = req.body;
    if (!validResults.includes(result)) {
      res.status(400).json({ error: 'result must be 1-0, 0-1, 0.5-0.5, or null' });
      return;
    }
    const pairing = await prisma.pairing.update({
      where: { id: req.params.pairingId },
      data: { result },
    });
    res.json(pairing);
  } catch (err) {
    console.error('Update pairing result error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
