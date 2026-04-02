import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

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

    // Rating limit filter: show tournaments where ratingLimit <= ratingMax (or ratingLimit is null = Open)
    if (req.query.ratingMax) {
      const ratingMax = parseInt(req.query.ratingMax as string);
      if (!isNaN(ratingMax)) {
        where.OR = [
          { ratingLimit: { lte: ratingMax } },
          { ratingLimit: null },
        ];
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

// TODO: Rewrite remaining tournament endpoints for new schema (#1597)
// - POST /tournaments (create)
// - PUT /tournaments/:id (update)
// - PATCH /tournaments/:id/status
// - POST /tournaments/:id/photos
// - POST /tournaments/:id/results
// - GET /tournaments/:id/participants
// - GET /tournaments/:id/results
// - GET /tournaments/:id/photos
// - Admin endpoints

export default router;
