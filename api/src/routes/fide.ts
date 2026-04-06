import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// PUT /api/profile/fide — save FIDE data to user profile (text-only, no external API)
router.put('/fide', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { fideId, fideRating, fideTitle } = req.body;

    if (!fideId || typeof fideId !== 'string') {
      res.status(400).json({ error: 'fideId is required' });
      return;
    }

    if (!/^\d{3,12}$/.test(fideId.trim())) {
      res.status(400).json({ error: 'Invalid FIDE ID format' });
      return;
    }

    const data: Record<string, string | number | null> = {
      fideId: fideId.trim(),
    };

    if (fideRating !== undefined) {
      data.fideRating = typeof fideRating === 'number' ? fideRating : null;
    }
    if (fideTitle !== undefined) {
      data.fideTitle = typeof fideTitle === 'string' && fideTitle.length > 0 ? fideTitle : null;
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        role: true,
        rating: true,
        fideId: true,
        fideRating: true,
        fideTitle: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (err) {
    console.error('Save FIDE data error:', err);
    res.status(500).json({ error: 'Failed to save FIDE data' });
  }
});

export default router;
