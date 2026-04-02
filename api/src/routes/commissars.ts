import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

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

export default router;
