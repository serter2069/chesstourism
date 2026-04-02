import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { createStripeSession, handleWebhook, getPaymentStatus } from '../services/payment.service';
import { generateCertificate } from '../services/pdf.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// POST /api/payments/create-session — create Stripe checkout session
router.post(
  '/payments/create-session',
  authenticate,
  requireRole('PARTICIPANT'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { tournamentId } = req.body;

      if (!tournamentId) {
        res.status(400).json({ error: 'tournamentId is required' });
        return;
      }

      // Get tournament to find entry fee
      const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
      });

      if (!tournament) {
        res.status(404).json({ error: 'Tournament not found' });
        return;
      }

      if (!tournament.entry_fee || Number(tournament.entry_fee) === 0) {
        res.status(400).json({ error: 'This tournament has no entry fee' });
        return;
      }

      const result = await createStripeSession(
        req.user!.userId,
        tournamentId,
        Number(tournament.entry_fee),
        tournament.currency || 'USD',
      );

      res.json(result);
    } catch (err: any) {
      if (
        err.message === 'Not registered for this tournament' ||
        err.message === 'Already paid for this tournament'
      ) {
        res.status(400).json({ error: err.message });
        return;
      }
      console.error('Create payment session error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// POST /api/payments/webhook — Stripe webhook (raw body, mounted separately in index.ts)
router.post('/payments/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      res.status(400).json({ error: 'Missing stripe-signature header' });
      return;
    }

    await handleWebhook(req.body, signature);
    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/payments/status/:tournamentId — payment status for current user
router.get(
  '/payments/status/:tournamentId',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const status = await getPaymentStatus(
        req.user!.userId,
        req.params.tournamentId,
      );
      res.json(status);
    } catch (err: any) {
      if (err.message === 'Not registered for this tournament') {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error('Get payment status error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// GET /api/payments/certificate/:tournamentId — download certificate PDF
router.get(
  '/payments/certificate/:tournamentId',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const tournamentId = req.params.tournamentId;
      const userId = req.user!.userId;

      // Find result for this user in this tournament
      const result = await prisma.tournamentResult.findUnique({
        where: {
          tournament_id_user_id: { tournament_id: tournamentId, user_id: userId },
        },
        include: {
          tournament: true,
          user: true,
        },
      });

      if (!result) {
        res.status(404).json({ error: 'No results found for this tournament' });
        return;
      }

      if (result.place > 3) {
        res.status(400).json({ error: 'Certificates are only available for places 1-3' });
        return;
      }

      const pdf = generateCertificate(
        `${result.user.name} ${result.user.surname}`,
        result.tournament.title,
        result.place,
        result.tournament.end_date.toISOString().split('T')[0],
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="certificate-${result.tournament.title.replace(/\s+/g, '-')}-place-${result.place}.pdf"`,
      );
      res.send(pdf);
    } catch (err) {
      console.error('Generate certificate error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

export default router;
