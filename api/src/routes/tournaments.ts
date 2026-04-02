import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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

// GET /api/tournaments/:id — single tournament
router.get('/tournaments/:id', async (req: Request, res: Response) => {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: {
        commissioner: {
          select: { id: true, userId: true },
        },
      },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    res.json(tournament);
  } catch (err) {
    console.error('Get tournament error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO: Rewrite remaining tournament endpoints for new schema (#1597)
// - POST /tournaments (create)
// - PUT /tournaments/:id (update)
// - PATCH /tournaments/:id/status
// - POST /tournaments/:id/register
// - DELETE /tournaments/:id/register
// - POST /tournaments/:id/photos
// - POST /tournaments/:id/results
// - GET /tournaments/:id/participants
// - GET /tournaments/:id/results
// - GET /tournaments/:id/photos
// - Admin endpoints

export default router;
