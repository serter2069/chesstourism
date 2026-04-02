import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/ratings — public leaderboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (req.query.country) {
      where.user = { country: req.query.country as string };
    }

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where,
        skip,
        take: limit,
        orderBy: { elo: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              country: true,
            },
          },
        },
      }),
      prisma.rating.count({ where }),
    ]);

    const data = ratings.map((r, idx) => ({
      rank: skip + idx + 1,
      userId: r.user.id,
      name: r.user.name,
      surname: r.user.surname,
      country: r.user.country,
      elo: r.elo,
      games_played: r.games_played,
      wins: r.wins,
      losses: r.losses,
      draws: r.draws,
    }));

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get leaderboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/ratings/:userId — public single user rating
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const rating = await prisma.rating.findUnique({
      where: { user_id: req.params.userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            country: true,
          },
        },
      },
    });

    if (!rating) {
      res.status(404).json({ error: 'Rating not found' });
      return;
    }

    res.json({
      userId: rating.user.id,
      name: rating.user.name,
      surname: rating.user.surname,
      country: rating.user.country,
      elo: rating.elo,
      peak_elo: rating.peak_elo,
      games_played: rating.games_played,
      wins: rating.wins,
      losses: rating.losses,
      draws: rating.draws,
      updated_at: rating.updated_at,
    });
  } catch (err) {
    console.error('Get user rating error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
