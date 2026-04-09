import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Rate limit: max 3 submissions per IP per hour (UC-15 AC6)
const orgFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { error: 'Too many organization requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/organization-requests — canonical UC-15 endpoint (public, no auth required)
// POST /api/organizations/request — legacy alias (kept for backward compatibility)
async function handleOrganizationRequest(req: Request, res: Response): Promise<void> {
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
}

// GET /api/organizations — public paginated list of APPROVED organizations (UC-31)
router.get('/organizations', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const rawLimit = parseInt(req.query.limit as string) || 20;
    const limit = Math.min(rawLimit, 100);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.organizationRequest.findMany({
        where: { status: 'APPROVED' },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          organizationName: true,
          contactName: true,
          phone: true,
          description: true,
          createdAt: true,
        },
      }),
      prisma.organizationRequest.count({ where: { status: 'APPROVED' } }),
    ]);

    res.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Get organizations error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/organizations/my — authenticated user's own organization requests (UC-34)
// Must be registered before any /:id route to prevent "my" being matched as an id
router.get('/organizations/my', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Fetch email from DB — do not rely solely on JWT payload
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { email: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const requests = await prisma.organizationRequest.findMany({
      where: { email: user.email },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        organizationName: true,
        status: true,
        phone: true,
        description: true,
        createdAt: true,
      },
    });

    res.json(requests);
  } catch (err) {
    console.error('Get my organization requests error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/organization-requests', orgFormLimiter, handleOrganizationRequest);
router.post('/organizations/request', orgFormLimiter, handleOrganizationRequest);

export default router;
