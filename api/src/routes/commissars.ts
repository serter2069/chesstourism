import { Router, Response } from 'express';
import Redis from 'ioredis';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();
const redis = new Redis({ host: '127.0.0.1', port: 6379, lazyConnect: true });

// GET /api/commissars — public list of all commissioners
// Supports ?country= filter to return only commissioners from a specific country
router.get('/', async (req: any, res: Response) => {
  try {
    const { country } = req.query as { country?: string };

    const where: Record<string, any> = {};
    if (country && typeof country === 'string' && country.trim()) {
      where.country = { equals: country.trim(), mode: 'insensitive' };
    }

    const commissioners = await prisma.commissioner.findMany({
      where,
      orderBy: { country: 'asc' },
      include: {
        user: {
          select: { id: true, name: true },
        },
        _count: {
          select: { tournaments: true },
        },
      },
    });

    const data = commissioners.map((c: any) => ({
      id: c.id,
      userId: c.userId,
      specialization: c.specialization,
      country: c.country,
      city: c.city,
      photoUrl: c.photoUrl,
      isVerified: c.isVerified,
      user: c.user,
      tournamentsCount: c._count.tournaments,
    }));

    // Also return the list of distinct countries for the country filter chips
    const allCountries = await prisma.commissioner.findMany({
      where: { country: { not: null } },
      select: { country: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    });

    const countries = allCountries
      .map((c: any) => c.country as string)
      .filter(Boolean);

    res.json({ data, countries, pagination: { totalPages: 1 } });
  } catch (err: any) {
    console.error('List commissioners error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/commissars/profile — get own commissioner profile
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const commissioner = await prisma.commissioner.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true, rating: true },
        },
      },
    });

    if (!commissioner) {
      res.status(404).json({ error: 'Commissioner profile not found' });
      return;
    }

    res.json(commissioner);
  } catch (err: any) {
    console.error('Get commissioner profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/commissars/profile — update own commissioner profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { bio, specialization, country, city, photoUrl } = req.body;

    // Ensure commissioner record exists for this user
    const existing = await prisma.commissioner.findUnique({ where: { userId } });
    if (!existing) {
      res.status(404).json({ error: 'Commissioner profile not found' });
      return;
    }

    // Validate string fields
    const updates: Record<string, any> = {};
    if (bio !== undefined) updates.bio = typeof bio === 'string' ? bio.slice(0, 2000) : null;
    if (specialization !== undefined) updates.specialization = typeof specialization === 'string' ? specialization.slice(0, 200) : null;
    if (country !== undefined) updates.country = typeof country === 'string' ? country.slice(0, 100) : null;
    if (city !== undefined) updates.city = typeof city === 'string' ? city.slice(0, 100) : null;
    if (photoUrl !== undefined) updates.photoUrl = typeof photoUrl === 'string' ? photoUrl.slice(0, 500) : null;

    const updated = await prisma.commissioner.update({
      where: { userId },
      data: updates,
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true, rating: true },
        },
      },
    });

    res.json(updated);
  } catch (err: any) {
    console.error('Update commissioner profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/commissars/tournaments — list tournaments created by this commissioner
router.get('/tournaments', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const commissioner = await prisma.commissioner.findUnique({ where: { userId } });
    if (!commissioner) {
      res.status(404).json({ error: 'Commissioner profile not found' });
      return;
    }

    const tournaments = await prisma.tournament.findMany({
      where: { commissionerId: commissioner.id },
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    res.json({ tournaments });
  } catch (err: any) {
    console.error('Get commissioner tournaments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/commissars/register — become a commissioner (create Commissioner record)
router.post('/register', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Check if already has a commissioner record
    const existing = await prisma.commissioner.findUnique({ where: { userId } });
    if (existing) {
      res.status(409).json({ error: 'Commissioner profile already exists' });
      return;
    }

    // Update user role to COMMISSIONER and create Commissioner record in transaction
    const [user, commissioner] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { role: 'COMMISSIONER' },
      }),
      prisma.commissioner.create({
        data: { userId },
      }),
    ]);

    res.status(201).json({
      ok: true,
      commissioner,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('Register as commissioner error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/commissars/:userId/stats — aggregate stats for a commissioner by userId
// Cached in Redis/Valkey for 5 minutes
router.get('/:userId/stats', async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const cacheKey = `commissar:stats:${userId}`;

    // Try cache first
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    // Find commissioner by userId
    const commissioner = await prisma.commissioner.findUnique({
      where: { userId },
    });
    if (!commissioner) {
      res.status(404).json({ error: 'Commissioner not found' });
      return;
    }

    // Fetch all tournaments with approved/paid registrations and participant ratings
    const tournaments = await prisma.tournament.findMany({
      where: { commissionerId: commissioner.id },
      orderBy: { startDate: 'desc' },
      select: {
        startDate: true,
        registrations: {
          where: { status: { in: ['APPROVED', 'PAID'] } },
          select: {
            user: { select: { rating: true } },
          },
        },
      },
    });

    const tournamentsHosted = tournaments.length;
    const allParticipants = tournaments.flatMap((t: any) => t.registrations);
    const totalParticipants = allParticipants.length;
    const averageParticipants =
      tournamentsHosted > 0
        ? Math.round(totalParticipants / tournamentsHosted)
        : 0;

    const ratings = allParticipants
      .map((r: any) => r.user?.rating)
      .filter((v: any): v is number => typeof v === 'number' && v > 0);
    const averageParticipantElo =
      ratings.length > 0
        ? Math.round(ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length)
        : 0;

    const lastTournamentDate = tournaments.length > 0 ? tournaments[0].startDate : null;

    const stats = {
      tournamentsHosted,
      totalParticipants,
      averageParticipants,
      averageParticipantElo,
      lastTournamentDate,
    };

    // Cache for 5 minutes (300 seconds)
    await redis.setex(cacheKey, 300, JSON.stringify(stats)).catch(() => {});

    res.json(stats);
  } catch (err: any) {
    console.error('Commissioner stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/commissars/:id — public commissioner profile by commissioner id or userId
router.get('/:id', async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    // Support lookup by commissioner.id or commissioner.userId
    const commissioner = await prisma.commissioner.findFirst({
      where: { OR: [{ id }, { userId: id }] },
      include: {
        user: {
          select: { id: true, name: true },
        },
        tournaments: {
          orderBy: { startDate: 'desc' },
          include: {
            _count: {
              select: { registrations: true },
            },
          },
        },
      },
    });

    if (!commissioner) {
      res.status(404).json({ error: 'Commissioner not found' });
      return;
    }

    const totalParticipants = commissioner.tournaments.reduce(
      (sum: number, t: any) => sum + t._count.registrations,
      0
    );

    res.json({
      id: commissioner.id,
      userId: commissioner.userId,
      bio: commissioner.bio,
      specialization: commissioner.specialization,
      country: commissioner.country,
      city: commissioner.city,
      photoUrl: commissioner.photoUrl,
      isVerified: commissioner.isVerified,
      user: commissioner.user,
      stats: {
        totalTournaments: commissioner.tournaments.length,
        totalParticipants,
      },
      tournaments: commissioner.tournaments.map((t: any) => ({
        id: t.id,
        title: t.title,
        city: t.city,
        country: t.country,
        startDate: t.startDate,
        endDate: t.endDate,
        status: t.status,
        participantsCount: t._count.registrations,
        maxParticipants: t.maxParticipants,
        timeControl: t.timeControl,
      })),
    });
  } catch (err: any) {
    console.error('Get commissioner public profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
