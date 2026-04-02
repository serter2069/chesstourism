import { Router, Request, Response } from 'express';
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

export default router;
