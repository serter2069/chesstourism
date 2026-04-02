import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/watchlist — list user's watchlisted tournaments
router.get('/watchlist', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const watchlist = await prisma.tournamentWatchlist.findMany({
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
            fee: true,
            currency: true,
            ratingLimit: true,
            timeControl: true,
          },
        },
      },
    });

    res.json(watchlist.map((w) => ({
      id: w.id,
      tournamentId: w.tournamentId,
      createdAt: w.createdAt,
      tournament: w.tournament,
    })));
  } catch (err) {
    console.error('Get watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/watchlist/ids — list just tournament IDs (for quick lookup on cards)
router.get('/watchlist/ids', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const watchlist = await prisma.tournamentWatchlist.findMany({
      where: { userId },
      select: { tournamentId: true },
    });

    res.json(watchlist.map((w) => w.tournamentId));
  } catch (err) {
    console.error('Get watchlist IDs error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/watchlist — add tournament to watchlist
router.post('/watchlist', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { tournamentId } = req.body;

    if (!tournamentId || typeof tournamentId !== 'string') {
      res.status(400).json({ error: 'tournamentId is required' });
      return;
    }

    // Verify tournament exists
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    const entry = await prisma.tournamentWatchlist.upsert({
      where: {
        userId_tournamentId: { userId, tournamentId },
      },
      update: {}, // already exists — no-op
      create: { userId, tournamentId },
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error('Add to watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/watchlist/:tournamentId — remove from watchlist
router.delete('/watchlist/:tournamentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { tournamentId } = req.params;

    await prisma.tournamentWatchlist.deleteMany({
      where: { userId, tournamentId },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Remove from watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
