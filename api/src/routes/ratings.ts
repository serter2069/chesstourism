import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import prisma from '../lib/prisma';

const router = Router();

interface UserSummary {
  userId: string;
  name: string;
  city: string | null;
  country: string | null;
  fideTitle: string | null;
  effectiveRating: number;
  tournamentCount: number;
}

interface AllUserRating {
  id: string;
  rating: number;
  fideRating: number | null;
}

// Compute effective rating: fideRating takes priority, else approved registrations × 10
function effectiveRating(fideRating: number | null, rating: number): number {
  if (fideRating !== null && fideRating > 0) return fideRating;
  return rating;
}

// GET /api/ratings/countries — distinct countries with player counts
router.get('/countries', async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.user.groupBy({
      by: ['country'],
      where: {
        role: 'PARTICIPANT',
        country: { not: null },
      },
      _count: { id: true },
      orderBy: { country: 'asc' },
    });

    const countries = rows
      .filter((r) => r.country !== null)
      .map((r) => ({ country: r.country as string, count: r._count.id }));

    res.json({ countries });
  } catch (err: any) {
    console.error('Ratings countries error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/ratings — leaderboard (top 50, paginated). Supports ?country= filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const skip = (page - 1) * limit;
    const countryFilter = typeof req.query.country === 'string' && req.query.country.trim()
      ? req.query.country.trim()
      : null;

    const where: any = { role: 'PARTICIPANT' };
    if (countryFilter) {
      where.country = { equals: countryFilter, mode: 'insensitive' };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        rating: true,
        fideRating: true,
        fideTitle: true,
        _count: {
          select: {
            tournamentRegistrations: {
              where: { status: { in: ['APPROVED', 'PAID'] } },
            },
          },
        },
      },
      where,
    });

    type UserRow = typeof users[0];

    // Sort by effective rating DESC
    const sorted: UserSummary[] = users
      .map((u: UserRow) => ({
        userId: u.id,
        name: u.name ?? 'Unknown',
        city: u.city ?? null,
        country: u.country ?? null,
        fideTitle: u.fideTitle ?? null,
        effectiveRating: effectiveRating(u.fideRating, u.rating),
        tournamentCount: u._count.tournamentRegistrations,
      }))
      .filter((u: UserSummary) => u.effectiveRating > 0)
      .sort((a: UserSummary, b: UserSummary) => b.effectiveRating - a.effectiveRating);

    const total = sorted.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = sorted.slice(skip, skip + limit);

    const data = paginated.map((u: UserSummary, idx: number) => ({
      rank: skip + idx + 1,
      userId: u.userId,
      name: u.name,
      city: u.city,
      country: u.country,
      fideTitle: u.fideTitle,
      rating: u.effectiveRating,
      tournamentCount: u.tournamentCount,
    }));

    res.json({
      data,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err: any) {
    console.error('Ratings leaderboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/ratings/my — current user's rank and rating
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const [user, allUsers] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          city: true,
          rating: true,
          fideRating: true,
          fideTitle: true,
          _count: {
            select: {
              tournamentRegistrations: {
                where: { status: { in: ['APPROVED', 'PAID'] } },
              },
            },
          },
        },
      }),
      prisma.user.findMany({
        where: { role: 'PARTICIPANT' },
        select: {
          id: true,
          rating: true,
          fideRating: true,
        },
      }),
    ]);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const myRating = effectiveRating(user.fideRating, user.rating);

    // Rank = number of participants with higher effective rating + 1
    const rank =
      (allUsers as AllUserRating[]).filter((u) => effectiveRating(u.fideRating, u.rating) > myRating).length + 1;

    res.json({
      userId,
      name: user.name ?? 'Unknown',
      city: user.city ?? null,
      fideTitle: user.fideTitle ?? null,
      rating: myRating,
      tournamentCount: user._count.tournamentRegistrations,
      rank,
      total: allUsers.length,
    });
  } catch (err: any) {
    console.error('My rating error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/ratings/update — Admin only: manually set a user's rating
router.post(
  '/update',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { userId, rating } = req.body;

      if (!userId || typeof rating !== 'number' || rating < 0 || rating > 9999) {
        res.status(400).json({ error: 'Invalid userId or rating (0–9999)' });
        return;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { rating },
        select: { id: true, name: true, rating: true, fideRating: true },
      });

      res.json({
        ok: true,
        userId: user.id,
        name: user.name,
        rating: user.rating,
        fideRating: user.fideRating,
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      console.error('Update rating error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/ratings/history — paginated rating change history across all users (public)
router.get('/history', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where = {
      tournament: { status: 'COMPLETED' as const },
    };

    const [results, total] = await Promise.all([
      prisma.tournamentResult.findMany({
        where,
        select: {
          userId: true,
          tournamentId: true,
          place: true,
          score: true,
          eloChange: true,
          tournament: {
            select: { id: true, title: true, endDate: true },
          },
          user: {
            select: { id: true, name: true, city: true, country: true },
          },
        },
        orderBy: { tournament: { endDate: 'desc' } },
        skip,
        take: limit,
      }),
      prisma.tournamentResult.count({ where }),
    ]);

    res.json({
      data: results.map((r) => ({
        userId: r.userId,
        userName: r.user.name,
        city: r.user.city,
        country: r.user.country,
        tournamentId: r.tournamentId,
        tournamentName: r.tournament.title,
        place: r.place,
        score: r.score,
        eloChange: r.eloChange,
        date: r.tournament.endDate,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err: any) {
    console.error('Rating history error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/ratings/:userId/history — paginated ELO change history for a user
router.get('/:userId/history', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where = {
      userId,
      tournament: { status: 'COMPLETED' as const },
    };

    const [results, total] = await Promise.all([
      prisma.tournamentResult.findMany({
        where,
        include: {
          tournament: {
            select: { id: true, title: true, endDate: true },
          },
        },
        orderBy: { tournament: { endDate: 'desc' } },
        skip,
        take: limit,
      }),
      prisma.tournamentResult.count({ where }),
    ]);

    res.json({
      data: results.map((r) => ({
        tournamentId: r.tournamentId,
        tournamentName: r.tournament.title,
        place: r.place,
        score: r.score,
        eloChange: r.eloChange,
        date: r.tournament.endDate,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err: any) {
    console.error('ELO history error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
