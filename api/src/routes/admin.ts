import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import prisma from '../lib/prisma';
import { sendOrganizationRequestDecision } from '../services/email.service';

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
    ] = await Promise.all([
      prisma.user.count(),
      prisma.tournament.count(),
      prisma.tournamentRegistration.count(),
      prisma.organizationRequest.count({ where: { status: 'PENDING' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' },
      }),
    ]);

    res.json({
      totalUsers,
      totalTournaments,
      totalRegistrations,
      totalRevenue: revenueResult._sum.amount || 0,
      pendingOrgRequests,
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
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin users error:', err);
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

    // Send email notification (fire and forget)
    sendOrganizationRequestDecision(
      existing.email,
      existing.contactName,
      existing.organizationName,
      true,
    ).catch((err) => console.error('Failed to send org request approval email:', err));

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

    // Send email notification (fire and forget)
    sendOrganizationRequestDecision(
      existing.email,
      existing.contactName,
      existing.organizationName,
      false,
      reason,
    ).catch((err) => console.error('Failed to send org request rejection email:', err));

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
      if (['PENDING', 'PAID', 'FAILED', 'REFUNDED'].includes(status)) {
        where.status = status;
      }
    }

    // Aggregations (always across the filtered set)
    const [paidAgg, pendingAgg, refundedCount, items, total] = await Promise.all([
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
      },
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin finances error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
