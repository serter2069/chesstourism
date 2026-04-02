import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/users/:id — public profile
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        surname: true,
        country: true,
        city: true,
        avatar_url: true,
        bio: true,
        role: true,
        created_at: true,
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
    const { name, surname, country, city, bio, avatar_url } = req.body;

    const data: Record<string, string | undefined> = {};
    if (name !== undefined) data.name = name;
    if (surname !== undefined) data.surname = surname;
    if (country !== undefined) data.country = country;
    if (city !== undefined) data.city = city;
    if (bio !== undefined) data.bio = bio;
    if (avatar_url !== undefined) data.avatar_url = avatar_url;

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
        country: true,
        city: true,
        avatar_url: true,
        bio: true,
        role: true,
        updated_at: true,
      },
    });

    res.json(user);
  } catch (err) {
    console.error('Update user profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/me/tournaments — list user's tournament registrations (authenticated)
router.get('/me/tournaments', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const participations = await prisma.tournamentParticipant.findMany({
      where: { user_id: req.user!.userId },
      include: {
        tournament: {
          select: {
            id: true,
            title: true,
            format: true,
            status: true,
            start_date: true,
            end_date: true,
            city: true,
            country: true,
          },
        },
      },
      orderBy: { registered_at: 'desc' },
    });

    res.json(participations);
  } catch (err) {
    console.error('Get user tournaments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
