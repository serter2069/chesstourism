import { Router, Response, Request } from 'express';
import Stripe from 'stripe';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { createNotification } from '../utils/notifications';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
});

// POST /api/payments/tournament/:tournamentId — create Stripe Checkout session
router.post('/payments/tournament/:tournamentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { tournamentId } = req.params;

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    const registration = await prisma.tournamentRegistration.findUnique({
      where: { tournamentId_userId: { tournamentId, userId } },
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
    const currency = (tournament.currency || 'USD').toLowerCase();

    if (fee === 0) {
      res.status(400).json({ error: 'This tournament is free — no payment required' });
      return;
    }

    // Reuse existing pending payment if checkout session still valid
    const existing = await prisma.payment.findFirst({
      where: { userId, tournamentId, status: 'PENDING', externalId: { not: null } },
      orderBy: { createdAt: 'desc' },
    });

    if (existing?.externalId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(existing.externalId);
        if (session.status === 'open') {
          res.json({ checkoutUrl: session.url, paymentId: existing.id });
          return;
        }
      } catch {
        // session expired or invalid — create new one
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    const origin = process.env.APP_URL || 'https://chesstourism.smartlaunchhub.com';

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user?.email || undefined,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Tournament Registration: ${tournament.title}`,
              description: `${tournament.city}, ${tournament.country}`,
            },
            unit_amount: Math.round(fee * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        tournamentId,
        userId,
        registrationId: registration.id,
      },
      success_url: `${origin}/payment-success?tournamentId=${tournamentId}`,
      cancel_url: `${origin}/tournaments/${tournamentId}`,
    });

    // Store payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        tournamentId,
        amount: fee,
        currency: currency.toUpperCase(),
        status: 'PENDING',
        externalId: session.id,
      },
    });

    res.status(201).json({
      checkoutUrl: session.url,
      paymentId: payment.id,
      sessionId: session.id,
    });
  } catch (err) {
    console.error('Create checkout session error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/payments/webhook — Stripe webhook handler
// Note: raw body middleware is applied in index.ts before express.json()
router.post('/payments/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== 'paid') {
      res.json({ received: true });
      return;
    }

    const { tournamentId, userId } = session.metadata || {};
    if (!tournamentId || !userId) {
      console.error('Webhook: missing metadata', session.metadata);
      res.json({ received: true });
      return;
    }

    // Idempotency check — Stripe retries webhooks; skip if already processed
    const alreadyProcessed = await prisma.webhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });
    if (alreadyProcessed) {
      console.log(`Webhook: duplicate event ${event.id}, skipping`);
      res.json({ received: true });
      return;
    }

    try {
      await prisma.$transaction([
        prisma.payment.updateMany({
          where: { externalId: session.id, status: 'PENDING' },
          data: { status: 'PAID' },
        }),
        prisma.tournamentRegistration.update({
          where: { tournamentId_userId: { tournamentId, userId } },
          data: { status: 'PAID' },
        }),
        prisma.webhookEvent.create({
          data: { stripeEventId: event.id, eventType: event.type, status: 'processed' },
        }),
      ]);
      console.log(`Payment confirmed for user ${userId}, tournament ${tournamentId}`);
    } catch (err) {
      console.error('Webhook: DB update failed:', err);
      // Dead letter: record failed event so it can be inspected/replayed
      try {
        await prisma.webhookEvent.create({
          data: {
            stripeEventId: `${event.id}:${Date.now()}`,
            eventType: event.type,
            status: 'failed',
            errorMessage: err instanceof Error ? err.message : String(err),
            rawRef: `${event.id}:${event.type}`,
          },
        });
      } catch (dlErr) {
        console.error('Webhook: dead letter write also failed:', dlErr);
      }
      // Return 500 so Stripe retries
      res.status(500).json({ error: 'DB update failed' });
      return;
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent;

    // Idempotency check
    const alreadyProcessed = await prisma.webhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });
    if (alreadyProcessed) {
      console.log(`Webhook: duplicate payment_failed event ${event.id}, skipping`);
      res.json({ received: true });
      return;
    }

    // Resolve payment_intent → checkout session → our Payment record
    let sessionId: string | null = null;
    try {
      const sessions = await stripe.checkout.sessions.list({ payment_intent: pi.id, limit: 1 });
      if (sessions.data.length > 0) {
        sessionId = sessions.data[0].id;
      }
    } catch (err) {
      console.error(`Webhook payment_failed: failed to resolve PI ${pi.id} to session:`, err);
    }

    if (!sessionId) {
      console.warn(`Webhook payment_failed: no checkout session found for PI ${pi.id}`);
      // Dead letter — no session found, can't update payment record
      try {
        await prisma.webhookEvent.create({
          data: {
            stripeEventId: event.id,
            eventType: event.type,
            status: 'failed',
            errorMessage: `No checkout session found for PaymentIntent ${pi.id}`,
            rawRef: `${event.id}:${event.type}`,
          },
        });
      } catch (dlErr) {
        console.error('Webhook payment_failed: dead letter write failed:', dlErr);
      }
      res.json({ received: true });
      return;
    }

    const payment = await prisma.payment.findFirst({ where: { externalId: sessionId } });

    if (!payment) {
      console.warn(`Webhook payment_failed: no Payment record for session ${sessionId}`);
      // Dead letter — session resolved but no matching payment row
      try {
        await prisma.webhookEvent.create({
          data: {
            stripeEventId: event.id,
            eventType: event.type,
            status: 'failed',
            errorMessage: `No Payment record for checkout session ${sessionId} (PI: ${pi.id})`,
            rawRef: `${event.id}:${event.type}`,
          },
        });
      } catch (dlErr) {
        console.error('Webhook payment_failed: dead letter write failed:', dlErr);
      }
      res.json({ received: true });
      return;
    }

    // Update payment status and record event atomically
    try {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        }),
        prisma.webhookEvent.create({
          data: { stripeEventId: event.id, eventType: event.type, status: 'processed' },
        }),
      ]);
      console.log(`Payment ${payment.id} marked FAILED (PI: ${pi.id})`);
    } catch (err) {
      console.error('Webhook payment_failed: DB update failed:', err);
      // Dead letter
      try {
        await prisma.webhookEvent.create({
          data: {
            stripeEventId: `${event.id}:${Date.now()}`,
            eventType: event.type,
            status: 'failed',
            errorMessage: err instanceof Error ? err.message : String(err),
            rawRef: `${event.id}:${event.type}`,
          },
        });
      } catch (dlErr) {
        console.error('Webhook payment_failed: dead letter write also failed:', dlErr);
      }
      res.status(500).json({ error: 'DB update failed' });
      return;
    }
  } else if (event.type === 'charge.dispute.created') {
    const dispute = event.data.object as Stripe.Dispute;
    const chargeId = dispute.charge as string;

    // Idempotency check
    const alreadyProcessed = await prisma.webhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });
    if (alreadyProcessed) {
      console.log(`Webhook: duplicate dispute event ${event.id}, skipping`);
      res.json({ received: true });
      return;
    }

    // Resolve charge → payment_intent → checkout session → our Payment record
    // Done OUTSIDE any DB transaction as these are Stripe API calls
    let sessionId: string | null = null;
    try {
      const charge = await stripe.charges.retrieve(chargeId);
      const paymentIntentId = charge.payment_intent as string | null;
      if (paymentIntentId) {
        const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 });
        if (sessions.data.length > 0) {
          sessionId = sessions.data[0].id;
        }
      }
    } catch (err) {
      console.error(`Webhook dispute: failed to resolve charge ${chargeId} to session:`, err);
      // Don't fail — mark event processed and continue
    }

    // Find payment by session ID (externalId)
    const payment = sessionId
      ? await prisma.payment.findFirst({ where: { externalId: sessionId } })
      : null;

    if (!payment) {
      console.warn(`Webhook dispute: no payment found for charge ${chargeId} (sessionId=${sessionId ?? 'unknown'})`);
      // Still record idempotency and return 200 so Stripe doesn't retry indefinitely
      await prisma.webhookEvent.create({
        data: { stripeEventId: event.id, eventType: event.type, status: 'processed' },
      });
      res.json({ received: true });
      return;
    }

    // Update payment status and record event atomically
    try {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'DISPUTED' },
        }),
        prisma.webhookEvent.create({
          data: { stripeEventId: event.id, eventType: event.type, status: 'processed' },
        }),
      ]);
      console.log(`Payment ${payment.id} marked DISPUTED (charge ${chargeId}, dispute ${dispute.id})`);
    } catch (err) {
      console.error('Webhook dispute: DB update failed:', err);
      // Dead letter
      try {
        await prisma.webhookEvent.create({
          data: {
            stripeEventId: `${event.id}:${Date.now()}`,
            eventType: event.type,
            status: 'failed',
            errorMessage: err instanceof Error ? err.message : String(err),
            rawRef: `${event.id}:${event.type}`,
          },
        });
      } catch (dlErr) {
        console.error('Webhook dispute: dead letter write also failed:', dlErr);
      }
      res.status(500).json({ error: 'DB update failed' });
      return;
    }

    // Notify all admins (fire-and-forget — must not fail the webhook response)
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true },
      });
      await Promise.all(
        admins.map((admin) =>
          createNotification(
            admin.id,
            'PAYMENT_DISPUTED',
            'Payment Disputed',
            `A chargeback dispute was opened for payment #${payment.id} (amount: ${payment.amount} ${payment.currency}). Dispute ID: ${dispute.id}.`,
            {
              paymentId: payment.id,
              disputeId: dispute.id,
              chargeId,
              amount: payment.amount,
              currency: payment.currency,
              reason: dispute.reason,
            },
          ),
        ),
      );
    } catch (err) {
      console.error('Webhook dispute: failed to create admin notifications:', err);
    }
  }

  res.json({ received: true });
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
