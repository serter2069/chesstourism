import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
const router = Router();

// POST /api/payments/tournament/:tournamentId — initiate payment for tournament registration
router.post('/payments/tournament/:tournamentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { tournamentId } = req.params;

    // Find tournament
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    // Check user has an APPROVED registration
    const registration = await prisma.tournamentRegistration.findUnique({
      where: {
        tournamentId_userId: { tournamentId, userId },
      },
    });

    if (!registration) {
      res.status(400).json({ error: 'You are not registered for this tournament' });
      return;
    }

    if (registration.status === 'PAID') {
      res.status(400).json({ error: 'Registration is already paid' });
      return;
    }

    if (registration.status !== 'APPROVED') {
      res.status(400).json({ error: 'Registration must be approved before payment' });
      return;
    }

    const fee = tournament.fee ?? 0;
    const currency = tournament.currency || 'USD';

    if (fee === 0) {
      res.status(400).json({ error: 'This tournament is free — no payment required' });
      return;
    }

    // Check if there's already a pending payment
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId,
        tournamentId,
        status: 'PENDING',
      },
    });

    if (existingPayment) {
      res.json({
        paymentId: existingPayment.id,
        amount: existingPayment.amount,
        currency: existingPayment.currency,
        status: existingPayment.status,
      });
      return;
    }

    // Create new payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        tournamentId,
        amount: fee,
        currency,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
    });
  } catch (err) {
    console.error('Initiate payment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/payments/:paymentId/confirm — confirm payment (mock: always succeeds in dev)
// TODO: integrate Stripe — replace mock confirmation with Stripe payment intent verification
router.post('/payments/:paymentId/confirm', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { paymentId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    if (payment.userId !== userId) {
      res.status(403).json({ error: 'Not your payment' });
      return;
    }

    if (payment.status === 'PAID') {
      res.status(400).json({ error: 'Payment already confirmed' });
      return;
    }

    if (payment.status !== 'PENDING') {
      res.status(400).json({ error: 'Payment cannot be confirmed in current status' });
      return;
    }

    // Mock confirmation — in production, verify Stripe payment intent here
    const [updatedPayment] = await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'PAID' },
      }),
      prisma.tournamentRegistration.update({
        where: {
          tournamentId_userId: {
            tournamentId: payment.tournamentId!,
            userId,
          },
        },
        data: {
          status: 'PAID',
          paymentId: paymentId,
        },
      }),
    ]);

    res.json({
      paymentId: updatedPayment.id,
      status: updatedPayment.status,
      amount: updatedPayment.amount,
      currency: updatedPayment.currency,
      message: 'Payment confirmed successfully',
    });
  } catch (err) {
    console.error('Confirm payment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/payments/my — list current user's payments
router.get('/payments/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        tournament: {
          select: {
            id: true,
            title: true,
            city: true,
            country: true,
            startDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(payments);
  } catch (err) {
    console.error('List payments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
