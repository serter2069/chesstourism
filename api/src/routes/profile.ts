import { Router, Response } from 'express';
import multer from 'multer';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { generateMembershipCertificate } from '../services/pdf.service';
import { signDownloadToken } from '../utils/jwt';
import { validateAndUpload, UploadValidationError } from '../services/storage.service';

const router = Router();

// Accept up to 20MB at the multer layer (largest allowed category is document/PDF).
// Fine-grained type + size validation is handled inside validateAndUpload().
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// POST /api/profile/avatar — upload user avatar image
router.post('/avatar', authenticate, (req: AuthRequest, res: Response) => {
  avatarUpload.single('avatar')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File too large. Maximum size is 20MB' });
        return;
      }
      res.status(400).json({ error: err.message });
      return;
    } else if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded. Use field name "avatar"' });
        return;
      }

      const userId = req.user!.userId;
      const photoUrl = await validateAndUpload(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname,
        'avatar',
      );

      const user = await prisma.user.update({
        where: { id: userId },
        data: { photoUrl },
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          role: true,
          photoUrl: true,
        },
      });

      res.json({ ok: true, user });
    } catch (uploadErr: any) {
      if (uploadErr instanceof UploadValidationError) {
        res.status(400).json({ error: uploadErr.message });
        return;
      }
      console.error('Avatar upload error:', uploadErr);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// POST /api/profile/commissioner-avatar — upload commissioner avatar (updates Commissioner.photoUrl)
router.post('/commissioner-avatar', authenticate, (req: AuthRequest, res: Response) => {
  avatarUpload.single('avatar')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File too large. Maximum size is 20MB' });
        return;
      }
      res.status(400).json({ error: err.message });
      return;
    } else if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded. Use field name "avatar"' });
        return;
      }

      const userId = req.user!.userId;

      const commissioner = await prisma.commissioner.findUnique({ where: { userId } });
      if (!commissioner) {
        res.status(404).json({ error: 'Commissioner profile not found' });
        return;
      }

      const photoUrl = await validateAndUpload(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname,
        'avatar',
      );

      const updated = await prisma.commissioner.update({
        where: { userId },
        data: { photoUrl },
        select: { id: true, userId: true, photoUrl: true },
      });

      res.json({ ok: true, commissioner: updated });
    } catch (uploadErr: any) {
      if (uploadErr instanceof UploadValidationError) {
        res.status(400).json({ error: uploadErr.message });
        return;
      }
      console.error('Commissioner avatar upload error:', uploadErr);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// POST /api/profile/preferences — save user preferences (skillLevel, countries, experience)
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

// GET /api/profile/download-token — issue a short-lived download token (5min, scope:'download')
// Used by native clients to avoid passing full access JWT via query param
router.get('/download-token', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const downloadToken = signDownloadToken(userId);
    res.json({ downloadToken });
  } catch (err: any) {
    console.error('Download token error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/profile/membership-certificate — download membership certificate PDF
router.get('/membership-certificate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, surname: true, email: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const membership = await prisma.membership.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });

    if (!membership) {
      res.status(404).json({ error: 'No active membership found' });
      return;
    }

    const memberName = [user.name, user.surname].filter(Boolean).join(' ') || user.email;
    const profileUrl = `https://chesstourism.smartlaunchhub.com/profile/${user.id}`;

    const pdfBuffer = await generateMembershipCertificate(
      memberName,
      user.email,
      membership.id,
      membership.startDate,
      membership.endDate,
      profileUrl,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=membership-certificate.pdf',
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error('Membership certificate error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
