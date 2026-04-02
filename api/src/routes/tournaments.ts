import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { createNotification } from '../utils/notifications';
import { submitResults, getResults, AppError } from '../services/tournament.service';
import prisma from '../lib/prisma';

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

    if (req.query.status) where.status = req.query.status as string;
    if (req.query.country) where.country = req.query.country as string;
    if (req.query.city) where.city = req.query.city as string;

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

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          commissioner: {
            select: { id: true, userId: true },
          },
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
          select: { id: true, userId: true },
        },
        _count: {
          select: { registrations: true },
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

    res.json({
      ...tournament,
      registrationCount: tournament._count.registrations,
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

// POST /api/tournaments — create tournament (Commissioner/Admin only)
router.post('/tournaments', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const commissioner = await getCommissioner(userId);

    if (!commissioner) {
      res.status(400).json({ error: 'Complete your commissioner profile first' });
      return;
    }

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
      include: { commissioner: { select: { userId: true } } },
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

    const { title, city, country, startDate, endDate, maxParticipants, fee, description, ratingLimit, timeControl, currency, status } = req.body;

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
    if (status !== undefined) data.status = status;

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

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data,
      include: {
        commissioner: { select: { id: true, userId: true } },
      },
    });

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
      include: { commissioner: { select: { userId: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: 'status is required' });
      return;
    }

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: { status },
    });

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
      include: { commissioner: { select: { userId: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this tournament' });
      return;
    }

    await prisma.tournament.delete({ where: { id: req.params.id } });
    res.json({ message: 'Tournament deleted' });
  } catch (err) {
    console.error('Delete tournament error:', err);
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
      include: { commissioner: { select: { userId: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to submit results for this tournament' });
      return;
    }

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

    const registration = await prisma.tournamentRegistration.create({
      data: { tournamentId, userId, status: 'PENDING' },
      select: { id: true, status: true, createdAt: true },
    });

    res.status(201).json(registration);
  } catch (err) {
    console.error('Tournament register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tournaments/:id/register — cancel own registration
router.delete('/tournaments/:id/register', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const tournamentId = req.params.id;
    const userId = req.user!.userId;

    const registration = await prisma.tournamentRegistration.findUnique({
      where: { tournamentId_userId: { tournamentId, userId } },
    });

    if (!registration) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }

    // Only allow cancelling PENDING registrations
    if (registration.status !== 'PENDING') {
      res.status(400).json({ error: 'Can only cancel pending registrations' });
      return;
    }

    await prisma.tournamentRegistration.delete({
      where: { id: registration.id },
    });

    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    console.error('Cancel registration error:', err);
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
      include: { commissioner: { select: { userId: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

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
      include: { commissioner: { select: { userId: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const { status } = req.body;
    if (!status || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      res.status(400).json({ error: 'status must be APPROVED, REJECTED, or PENDING' });
      return;
    }

    const registration = await prisma.tournamentRegistration.findFirst({
      where: { id: req.params.regId, tournamentId: req.params.id },
    });

    if (!registration) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }

    const updated = await prisma.tournamentRegistration.update({
      where: { id: req.params.regId },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true, rating: true, city: true } },
      },
    });

    // Send in-app notification when registration is approved or rejected
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
      include: { commissioner: { select: { userId: true } } },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

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

// DELETE /api/tournaments/:id/photos/:photoId — remove photo (Commissioner who owns tournament / Admin)
router.delete('/tournaments/:id/photos/:photoId', authenticate, requireRole('COMMISSIONER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
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

    if (role !== 'ADMIN' && tournament.commissioner.userId !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

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

export default router;
