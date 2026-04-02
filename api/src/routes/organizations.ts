import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import prisma from '../lib/prisma';

const router = Router();

// POST /api/organizations/request — public, no auth required
router.post('/organizations/request', async (req: Request, res: Response) => {
  try {
    const { organizationName, contactName, email, phone, description } = req.body;

    // Validate required fields
    const missing: string[] = [];
    if (!organizationName?.toString().trim()) missing.push('organizationName');
    if (!contactName?.toString().trim()) missing.push('contactName');
    if (!email?.toString().trim()) missing.push('email');
    if (!description?.toString().trim()) missing.push('description');

    if (missing.length > 0) {
      res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toString().trim())) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    const request = await prisma.organizationRequest.create({
      data: {
        organizationName: organizationName.toString().trim(),
        contactName: contactName.toString().trim(),
        email: email.toString().trim().toLowerCase(),
        phone: phone?.toString().trim() || null,
        description: description.toString().trim(),
      },
    });

    res.status(201).json({ id: request.id, status: request.status });
  } catch (err) {
    console.error('Create organization request error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/organizations/requests — Admin only, list all requests with optional status filter
router.get(
  '/organizations/requests',
  authenticate,
  requireRole('admin', 'ADMIN'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.query;

      const where: Record<string, unknown> = {};
      if (status) {
        where.status = status as string;
      }

      const requests = await prisma.organizationRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      res.json({ data: requests, total: requests.length });
    } catch (err) {
      console.error('List organization requests error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/organizations/requests/:id — Admin only, approve or reject
router.put(
  '/organizations/requests/:id',
  authenticate,
  requireRole('admin', 'ADMIN'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
        res.status(400).json({ error: 'status must be APPROVED or REJECTED' });
        return;
      }

      const existing = await prisma.organizationRequest.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ error: 'Request not found' });
        return;
      }

      const updated = await prisma.organizationRequest.update({
        where: { id },
        data: { status },
      });

      res.json(updated);
    } catch (err) {
      console.error('Update organization request error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
