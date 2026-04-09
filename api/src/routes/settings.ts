import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/settings/hero — returns hero banner content for the homepage
router.get('/hero', (req, res) => {
  res.json({
    title: 'International Chess Tourism Association',
    subtitle: 'Discover chess tournaments and travel experiences around the world',
  });
});

// Allowed fields for PATCH /api/settings
const ALLOWED_SETTINGS_FIELDS = ['emailOptOut', 'language', 'pushNotifications'] as const;

type SettingsField = (typeof ALLOWED_SETTINGS_FIELDS)[number];

function isAllowedField(key: string): key is SettingsField {
  return (ALLOWED_SETTINGS_FIELDS as readonly string[]).includes(key);
}

// GET /api/settings — returns current user settings
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        emailOptOut: true,
        preferences: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const prefs = (user.preferences as Record<string, unknown>) || {};

    res.json({
      emailOptOut: user.emailOptOut,
      language: (prefs.language as string) ?? 'en',
      pushNotifications: (prefs.pushNotifications as boolean) ?? true,
    });
  } catch (err: any) {
    console.error('GET /api/settings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/settings — update user settings (partial)
router.patch('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'Request body must be a JSON object' });
      return;
    }

    // Reject unknown fields
    const unknownFields = Object.keys(body).filter((k) => !isAllowedField(k));
    if (unknownFields.length > 0) {
      res.status(400).json({ error: `Unknown fields: ${unknownFields.join(', ')}` });
      return;
    }

    // Reject empty body
    if (Object.keys(body).length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    // Validate individual fields
    if ('emailOptOut' in body && typeof body.emailOptOut !== 'boolean') {
      res.status(400).json({ error: 'emailOptOut must be a boolean' });
      return;
    }

    if ('language' in body) {
      const validLanguages = ['en', 'ru', 'es', 'fr', 'de', 'zh'];
      if (typeof body.language !== 'string' || !validLanguages.includes(body.language)) {
        res.status(400).json({ error: `language must be one of: ${validLanguages.join(', ')}` });
        return;
      }
    }

    if ('pushNotifications' in body && typeof body.pushNotifications !== 'boolean') {
      res.status(400).json({ error: 'pushNotifications must be a boolean' });
      return;
    }

    // Fetch current user to merge preferences
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    if (!currentUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const currentPrefs = (currentUser.preferences as Record<string, unknown>) || {};

    // Build update data
    const updateData: Record<string, unknown> = {};

    // emailOptOut is a direct DB column
    if ('emailOptOut' in body) {
      updateData.emailOptOut = body.emailOptOut;
    }

    // language and pushNotifications are stored in preferences JSON
    const prefsUpdate: Record<string, unknown> = { ...currentPrefs };
    if ('language' in body) {
      prefsUpdate.language = body.language;
    }
    if ('pushNotifications' in body) {
      prefsUpdate.pushNotifications = body.pushNotifications;
    }

    if ('language' in body || 'pushNotifications' in body) {
      updateData.preferences = prefsUpdate;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        emailOptOut: true,
        preferences: true,
      },
    });

    const prefs = (updatedUser.preferences as Record<string, unknown>) || {};

    res.json({
      emailOptOut: updatedUser.emailOptOut,
      language: (prefs.language as string) ?? 'en',
      pushNotifications: (prefs.pushNotifications as boolean) ?? true,
    });
  } catch (err: any) {
    console.error('PATCH /api/settings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
