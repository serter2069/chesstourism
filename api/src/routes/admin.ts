import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import prisma from '../lib/prisma';

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

export default router;
