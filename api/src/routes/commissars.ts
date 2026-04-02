import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/roles';

const router = Router();
const prisma = new PrismaClient();

// GET /api/commissars — public list of approved commissars with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { approved: true };

    if (req.query.country) {
      where.user = { ...((where.user as Record<string, unknown>) || {}), country: req.query.country as string };
    }
    if (req.query.city) {
      where.user = { ...((where.user as Record<string, unknown>) || {}), city: req.query.city as string };
    }

    const [commissars, total] = await Promise.all([
      prisma.commissarProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              country: true,
              city: true,
              avatar_url: true,
            },
          },
        },
      }),
      prisma.commissarProfile.count({ where }),
    ]);

    res.json({
      data: commissars,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('List commissars error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/commissars/:userId — public commissar profile
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const profile = await prisma.commissarProfile.findFirst({
      where: {
        user_id: req.params.userId,
        approved: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            country: true,
            city: true,
            avatar_url: true,
            bio: true,
          },
        },
      },
    });

    if (!profile) {
      res.status(404).json({ error: 'Commissar profile not found' });
      return;
    }

    res.json(profile);
  } catch (err) {
    console.error('Get commissar profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/commissars/me — update own commissar profile (COMMISSAR only)
router.put('/me', authenticate, requireRole('COMMISSAR'), async (req: AuthRequest, res: Response) => {
  try {
    const { license_number, experience_years, specializations, bio } = req.body;

    const data: Record<string, unknown> = {};
    if (license_number !== undefined) data.license_number = license_number;
    if (experience_years !== undefined) data.experience_years = parseInt(experience_years, 10);
    if (specializations !== undefined) data.specializations = specializations;
    if (bio !== undefined) {
      // bio lives on the User model, update separately
      await prisma.user.update({
        where: { id: req.user!.userId },
        data: { bio },
      });
    }

    const profile = await prisma.commissarProfile.findUnique({
      where: { user_id: req.user!.userId },
    });

    if (!profile) {
      res.status(404).json({ error: 'Commissar profile not found' });
      return;
    }

    if (Object.keys(data).length > 0) {
      const updated = await prisma.commissarProfile.update({
        where: { user_id: req.user!.userId },
        data,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              country: true,
              city: true,
              bio: true,
            },
          },
        },
      });
      res.json(updated);
    } else {
      // Only bio was updated, return current profile
      const current = await prisma.commissarProfile.findUnique({
        where: { user_id: req.user!.userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              country: true,
              city: true,
              bio: true,
            },
          },
        },
      });
      res.json(current);
    }
  } catch (err) {
    console.error('Update commissar profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
