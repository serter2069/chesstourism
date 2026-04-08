import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/notifications — user's notifications (newest first, limit 20)
router.get('/notifications', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json(notifications);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/notifications/unread-count — {count: N}
router.get('/notifications/unread-count', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    res.json({ count });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/read-all — mark all as read
router.put('/notifications/read-all', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/:id/read — mark single notification as read
router.put('/notifications/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, userId },
    });
    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }
    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json(updated);
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const VALID_PLATFORMS = ['ios', 'android', 'web'] as const;

// POST /api/notifications/device-token — register/update FCM device token for authenticated user
router.post('/notifications/device-token', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const { token, platform } = req.body as { token?: string; platform?: string };

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      res.status(400).json({ error: 'token is required and must be a non-empty string' });
      return;
    }

    if (!platform || !VALID_PLATFORMS.includes(platform as (typeof VALID_PLATFORMS)[number])) {
      res.status(400).json({ error: 'platform must be ios, android, or web' });
      return;
    }

    // Upsert on unique token — handles re-login and device reassignment between users
    await prisma.deviceToken.upsert({
      where: { token },
      create: { userId, token: token.trim(), platform },
      update: { userId, platform },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Register device token error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/notifications/device-token — unregister FCM device token (on logout)
router.delete('/notifications/device-token', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const { token } = req.body as { token?: string };

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      res.status(400).json({ error: 'token is required and must be a non-empty string' });
      return;
    }

    // Scope by userId — prevents IDOR (user A cannot delete user B's token)
    // deleteMany is idempotent — no error if token doesn't exist or belongs to another user
    await prisma.deviceToken.deleteMany({
      where: { token: token.trim(), userId },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Unregister device token error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
