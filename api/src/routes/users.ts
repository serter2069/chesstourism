import { Router, Response } from 'express';
import { Prisma } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/users/me — own profile (authenticated)
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        birthDate: true,
        role: true,
        rating: true,
        fideId: true,
        fideRating: true,
        fideTitle: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error('Get own profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id/public — public profile with tournament count and history (no auth)
router.get('/:id/public', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [user, tournamentCount, history] = await Promise.all([
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          surname: true,
          country: true,
          fideTitle: true,
          fideRating: true,
          rating: true,
        },
      }),
      prisma.tournamentRegistration.count({
        where: {
          userId: id,
          status: { in: ['APPROVED', 'PAID'] },
        },
      }),
      prisma.tournamentResult.findMany({
        where: {
          userId: id,
          tournament: { status: 'COMPLETED' },
        },
        include: {
          tournament: {
            select: { id: true, title: true, endDate: true },
          },
        },
        orderBy: { tournament: { endDate: 'desc' } },
        take: 10,
      }),
    ]);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const effectiveRating =
      user.fideRating !== null && user.fideRating > 0 ? user.fideRating : user.rating;

    res.json({
      id: user.id,
      name: user.name,
      surname: user.surname,
      country: user.country,
      fideTitle: user.fideTitle,
      fideRating: user.fideRating,
      rating: effectiveRating,
      tournamentCount,
      history: history.map((r) => ({
        tournamentId: r.tournamentId,
        tournamentName: r.tournament.title,
        place: r.place,
        score: r.score,
        eloChange: r.eloChange,
        date: r.tournament.endDate,
      })),
    });
  } catch (err) {
    console.error('Get public user profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id — public profile (basic)
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        role: true,
        rating: true,
        fideId: true,
        fideRating: true,
        fideTitle: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/me — update own profile (authenticated)
router.put('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, surname, phone, city, country, birthDate, fideId } = req.body;

    // Strip HTML tags to prevent stored XSS
    const stripHtml = (val: unknown): string | null => {
      if (val === null || val === undefined) return null;
      const s = String(val).replace(/<[^>]*>/g, '').trim();
      return s.length > 0 ? s : null;
    };

    const data: Prisma.UserUpdateInput = {};
    if (name !== undefined) {
      const cleaned = stripHtml(name);
      if (cleaned === null) { res.status(400).json({ error: 'name must not be empty' }); return; }
      if (cleaned.length > 100) { res.status(400).json({ error: 'name must be 100 characters or fewer' }); return; }
      data.name = cleaned;
    }
    if (surname !== undefined) {
      const cleaned = stripHtml(surname);
      if (cleaned === null) { res.status(400).json({ error: 'surname must not be empty' }); return; }
      if (cleaned.length > 100) { res.status(400).json({ error: 'surname must be 100 characters or fewer' }); return; }
      data.surname = cleaned;
    }
    if (phone !== undefined) data.phone = phone;
    if (city !== undefined) data.city = city;
    if (country !== undefined) data.country = country;
    if (fideId !== undefined) data.fideId = fideId;

    if (birthDate !== undefined) {
      // Validate ISO date string (YYYY-MM-DD or full ISO)
      const parsed = new Date(birthDate);
      if (isNaN(parsed.getTime())) {
        res.status(400).json({ error: 'Invalid birthDate format. Use YYYY-MM-DD.' });
        return;
      }
      data.birthDate = parsed;
    }

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data,
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        birthDate: true,
        role: true,
        rating: true,
        fideId: true,
        fideRating: true,
        fideTitle: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (err) {
    console.error('Update user profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
