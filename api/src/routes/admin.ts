import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import prisma from '../lib/prisma';
import { enqueueEmail } from '../lib/emailQueue';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate, requireRole('ADMIN'));

// GET /api/admin/stats — dashboard statistics
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalTournaments,
      totalRegistrations,
      pendingOrgRequests,
      revenueResult,
      disputedCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.tournament.count(),
      prisma.tournamentRegistration.count(),
      prisma.organizationRequest.count({ where: { status: 'PENDING' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' },
      }),
      prisma.payment.count({ where: { status: 'DISPUTED' } }),
    ]);

    res.json({
      totalUsers,
      totalTournaments,
      totalRegistrations,
      totalRevenue: revenueResult._sum.amount || 0,
      pendingOrgRequests,
      disputedCount,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/users — paginated user list with role filter
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (req.query.role) {
      where.role = (req.query.role as string).toUpperCase();
    }

    if (req.query.search) {
      const search = req.query.search as string;
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          city: true,
          rating: true,
          fideId: true,
          fideRating: true,
          fideTitle: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      items: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/registrations — paginated list of all tournament registrations
router.get('/registrations', async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (req.query.status) {
      const allowed = ['PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED'];
      const s = (req.query.status as string).toUpperCase();
      if (allowed.includes(s)) where.status = s;
    }

    if (req.query.tournamentId) {
      where.tournamentId = req.query.tournamentId as string;
    }

    if (req.query.userId) {
      where.userId = req.query.userId as string;
    }

    const [registrations, total] = await Promise.all([
      prisma.tournamentRegistration.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          createdAt: true,
          tournamentId: true,
          userId: true,
          tournament: { select: { title: true, startDate: true, currency: true } },
          user: { select: { name: true, email: true } },
          payment: { select: { id: true, status: true, amount: true } },
        },
      }),
      prisma.tournamentRegistration.count({ where }),
    ]);

    res.json({
      items: registrations,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (err) {
    console.error('Admin registrations error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id/role — change user role
router.put('/users/:id/role', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['PARTICIPANT', 'COMMISSIONER', 'ADMIN'];
    if (!role || !validRoles.includes(role.toUpperCase())) {
      res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
      return;
    }

    // Prevent admin from removing own admin role
    if (id === req.user!.userId && role.toUpperCase() !== 'ADMIN') {
      res.status(400).json({ error: 'Cannot remove your own admin role' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: role.toUpperCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Admin role change error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/tournaments — all tournaments with status filter
router.get('/tournaments', async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (req.query.status) {
      where.status = (req.query.status as string).toUpperCase();
    }

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          commissioner: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
          _count: { select: { registrations: true } },
        },
      }),
      prisma.tournament.count({ where }),
    ]);

    // Flatten commissioner name for convenience
    const items = tournaments.map((t) => ({
      ...t,
      commissarName: t.commissioner?.user?.name || 'Unknown',
      commissioner: undefined,
    }));

    res.json({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin tournaments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── ORGANIZATION REQUESTS ─────────────────────────────

// GET /api/admin/organization-requests — list all requests with optional status filter
router.get('/organization-requests', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    const where: Record<string, unknown> = {};
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status as string)) {
      where.status = status as string;
    }

    const requests = await prisma.organizationRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: requests, total: requests.length });
  } catch (err) {
    console.error('Admin list organization requests error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/organization-requests/:id/approve
router.patch('/organization-requests/:id/approve', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.organizationRequest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    if (existing.status !== 'PENDING') {
      res.status(400).json({ error: `Request already ${existing.status.toLowerCase()}` });
      return;
    }

    const updated = await prisma.organizationRequest.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    // Enqueue email notification (fire and forget, with retry)
    enqueueEmail('organization_request_decision', existing.email, {
      contactName: existing.contactName,
      organizationName: existing.organizationName,
      approved: true,
    }).catch((err) => console.error('Failed to enqueue org request approval email:', err));

    res.json(updated);
  } catch (err) {
    console.error('Admin approve organization request error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/organization-requests/:id/reject
router.patch('/organization-requests/:id/reject', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body as { reason?: string };

    const existing = await prisma.organizationRequest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    if (existing.status !== 'PENDING') {
      res.status(400).json({ error: `Request already ${existing.status.toLowerCase()}` });
      return;
    }

    const updated = await prisma.organizationRequest.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    // Enqueue email notification (fire and forget, with retry)
    enqueueEmail('organization_request_decision', existing.email, {
      contactName: existing.contactName,
      organizationName: existing.organizationName,
      approved: false,
      reason,
    }).catch((err) => console.error('Failed to enqueue org request rejection email:', err));

    res.json({ ...updated, rejectionReason: reason || null });
  } catch (err) {
    console.error('Admin reject organization request error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── COMMISSIONER APPROVAL ─────────────────────────────

// GET /api/admin/commissars?status=pending — list commissioners for review
router.get('/commissars', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query as { status?: string };

    const where: Record<string, unknown> = {};
    if (status === 'pending') {
      where.isVerified = false;
    } else if (status === 'approved') {
      where.isVerified = true;
    }

    const commissars = await prisma.commissioner.findMany({
      where,
      orderBy: { user: { createdAt: 'desc' } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
            createdAt: true,
          },
        },
      },
    });

    res.json({ items: commissars });
  } catch (err) {
    console.error('Admin list commissars error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/commissars/:id/approve — approve a commissioner
router.patch('/commissars/:id/approve', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.commissioner.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Commissioner not found' });
      return;
    }

    // Approve commissioner and elevate user role to COMMISSIONER in one transaction
    const [updated] = await prisma.$transaction([
      prisma.commissioner.update({
        where: { id },
        data: { isVerified: true },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.user.update({
        where: { id: existing.userId },
        data: { role: 'COMMISSIONER' },
      }),
    ]);

    // Enqueue email notification (fire and forget, with retry)
    enqueueEmail('commissar_approval', updated.user.email, {
      userName: updated.user.name,
      approved: true,
    }).catch((err) => console.error('Failed to enqueue commissar approval email:', err));

    res.json(updated);
  } catch (err) {
    console.error('Admin approve commissioner error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/commissars/:id/reject — reject a commissioner
router.patch('/commissars/:id/reject', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body as { reason?: string };

    const existing = await prisma.commissioner.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Commissioner not found' });
      return;
    }

    const updated = await prisma.commissioner.update({
      where: { id },
      data: { isVerified: false },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json({ ...updated, rejectionReason: reason || null });
  } catch (err) {
    console.error('Admin reject commissioner error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── FINANCES ─────────────────────────────────────────

// GET /api/admin/finances — revenue summary + paginated payment list
router.get('/finances', async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    // Date range filters
    if (req.query.from || req.query.to) {
      const createdAt: Record<string, Date> = {};
      if (req.query.from) {
        createdAt.gte = new Date(req.query.from as string);
      }
      if (req.query.to) {
        // Include the entire end day
        const toDate = new Date(req.query.to as string);
        toDate.setHours(23, 59, 59, 999);
        createdAt.lte = toDate;
      }
      where.createdAt = createdAt;
    }

    // Status filter
    if (req.query.status) {
      const status = (req.query.status as string).toUpperCase();
      if (['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'DISPUTED'].includes(status)) {
        where.status = status;
      }
    }

    // Aggregations (always across the filtered set)
    const [paidAgg, pendingAgg, refundedCount, disputedAgg, items, total] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        _count: true,
        where: { ...where, status: 'PAID' },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { ...where, status: 'PENDING' },
      }),
      prisma.payment.count({ where: { ...where, status: 'REFUNDED' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        _count: true,
        where: { ...where, status: 'DISPUTED' },
      }),
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          tournament: { select: { title: true, currency: true } },
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      summary: {
        totalRevenue: paidAgg._sum.amount || 0,
        paidCount: paidAgg._count || 0,
        pendingAmount: pendingAgg._sum.amount || 0,
        refundedCount,
        disputedCount: disputedAgg._count || 0,
        disputedAmount: disputedAgg._sum.amount || 0,
      },
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin finances error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/finances/export.csv — download all payments as CSV
router.get('/finances/export.csv', async (req: AuthRequest, res: Response) => {
  try {
    const where: Record<string, unknown> = {};

    // Date range filters
    if (req.query.from || req.query.to) {
      const createdAt: Record<string, Date> = {};
      if (req.query.from) {
        createdAt.gte = new Date(req.query.from as string);
      }
      if (req.query.to) {
        const toDate = new Date(req.query.to as string);
        toDate.setHours(23, 59, 59, 999);
        createdAt.lte = toDate;
      }
      where.createdAt = createdAt;
    }

    // Status filter
    if (req.query.status) {
      const status = (req.query.status as string).toUpperCase();
      if (['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'DISPUTED'].includes(status)) {
        where.status = status;
      }
    }

    const payments = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        tournament: { select: { title: true, currency: true } },
        user: { select: { email: true } },
      },
    });

    // CSV injection protection: sanitize string fields
    const sanitize = (val: string): string => {
      let safe = val.replace(/"/g, '""');
      if (/^[=+\-@]/.test(safe)) {
        safe = '\t' + safe;
      }
      return `"${safe}"`;
    };

    const header = 'id,user_email,tournament_title,amount,currency,status,created_at';
    const rows = payments.map((p) => {
      const currency = p.tournament?.currency || p.currency || 'USD';
      return [
        sanitize(p.id),
        sanitize(p.user?.email || ''),
        sanitize(p.tournament?.title || ''),
        p.amount,
        sanitize(currency),
        sanitize(p.status),
        sanitize(p.createdAt.toISOString()),
      ].join(',');
    });

    const csv = [header, ...rows].join('\n');
    const dateStr = new Date().toISOString().slice(0, 10);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="payments-${dateStr}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error('Admin finances CSV export error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Disputes ────────────────────────────────────────────────────────────────

// GET /api/admin/disputes — paginated list of disputed payments
router.get('/disputes', async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where: { status: 'DISPUTED' },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          tournament: { select: { title: true, currency: true } },
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.payment.count({ where: { status: 'DISPUTED' } }),
    ]);

    res.json({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin disputes list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Webhook Events ──────────────────────────────────────────────────────────

// GET /api/admin/webhooks — list webhook events with pagination + filters
router.get('/webhooks', async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (req.query.status) {
      const allowed = ['processed', 'failed', 'pending'];
      const s = (req.query.status as string).toLowerCase();
      if (allowed.includes(s)) where.status = s;
    }

    if (req.query.eventType) {
      where.eventType = req.query.eventType as string;
    }

    const [items, total] = await Promise.all([
      prisma.webhookEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { processedAt: 'desc' },
        select: {
          id: true,
          stripeEventId: true,
          eventType: true,
          status: true,
          processedAt: true,
          errorMessage: true,
          rawRef: true,
        },
      }),
      prisma.webhookEvent.count({ where }),
    ]);

    res.json({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin webhooks list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/webhooks/:id — get full webhook event detail
router.get('/webhooks/:id', async (req: AuthRequest, res: Response) => {
  try {
    const event = await prisma.webhookEvent.findUnique({
      where: { id: req.params.id },
    });
    if (!event) return res.status(404).json({ error: 'Not found' });
    res.json(event);
  } catch (err) {
    console.error('Admin webhook detail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/webhooks/:id/retry — mark failed event as pending for retry
router.patch('/webhooks/:id/retry', async (req: AuthRequest, res: Response) => {
  try {
    const event = await prisma.webhookEvent.findUnique({
      where: { id: req.params.id },
    });
    if (!event) return res.status(404).json({ error: 'Not found' });
    if (event.status !== 'failed') {
      return res.status(400).json({ error: 'Only failed events can be retried' });
    }
    const updated = await prisma.webhookEvent.update({
      where: { id: req.params.id },
      data: { status: 'pending', errorMessage: null },
    });
    res.json(updated);
  } catch (err) {
    console.error('Admin webhook retry error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
