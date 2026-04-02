import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

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

export default router;
