import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
const router = Router();

// POST /api/profile/preferences — save onboarding quiz answers
router.post('/preferences', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { skillLevel, countries, experience } = req.body;

    // Validate skillLevel
    const validSkillLevels = ['U1000', 'U1400', 'U1800', '2000+', 'SPECTATOR'];
    if (skillLevel && !validSkillLevels.includes(skillLevel)) {
      res.status(400).json({ error: 'Invalid skillLevel' });
      return;
    }

    // Validate countries — must be array of strings
    if (countries && (!Array.isArray(countries) || countries.some((c: any) => typeof c !== 'string'))) {
      res.status(400).json({ error: 'countries must be an array of strings' });
      return;
    }

    // Validate experience
    const validExperience = ['BEGINNER', 'SOME', 'EXPERIENCED'];
    if (experience && !validExperience.includes(experience)) {
      res.status(400).json({ error: 'Invalid experience value' });
      return;
    }

    const preferences = {
      skillLevel: skillLevel || null,
      countries: countries || [],
      experience: experience || null,
    };

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        preferences,
        onboardingCompleted: true,
      },
    });

    res.json({ ok: true, preferences: user.preferences, onboardingCompleted: user.onboardingCompleted });
  } catch (err: any) {
    console.error('Save preferences error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/profile/preferences — get current preferences
router.get('/preferences', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true, onboardingCompleted: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err: any) {
    console.error('Get preferences error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
