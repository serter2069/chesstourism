import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';
import prisma from './prisma';

// Dedicated Redis connection for BullMQ — do NOT reuse auth.service connections
const connection = new Redis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null });
connection.on('error', (err) => console.error('[PaymentRecovery] Redis error:', err.message));

const QUEUE_NAME = 'payment-recovery';
const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const STALE_AGE_MS = 15 * 60 * 1000; // 15 minutes

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
});

const queue = new Queue(QUEUE_NAME, { connection });

// Remove any existing repeatable job to avoid duplication on restart
queue.getRepeatableJobs().then((jobs) => {
  const existing = jobs.find((j) => j.name === 'check-missed-payments');
  if (existing) {
    return queue.removeRepeatableByKey(existing.key);
  }
}).then(() => {
  return queue.add(
    'check-missed-payments',
    {},
    {
      repeat: { every: INTERVAL_MS },
      removeOnComplete: true,
      removeOnFail: 5,
    },
  );
}).catch((err) => console.error('[PaymentRecovery] Failed to register repeatable job:', err.message));

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    const cutoff = new Date(Date.now() - STALE_AGE_MS);

    const stalePendingPayments = await prisma.payment.findMany({
      where: {
        status: 'PENDING',
        externalId: { not: null },
        createdAt: { lt: cutoff },
      },
    });

    if (stalePendingPayments.length === 0) {
      console.log('[PaymentRecovery] No stale PENDING payments found');
      return;
    }

    console.log(`[PaymentRecovery] Checking ${stalePendingPayments.length} stale PENDING payments`);

    for (const payment of stalePendingPayments) {
      const sessionId = payment.externalId!;
      const idempotencyKey = `cron:${sessionId}`;

      try {
        // Check idempotency — already processed by cron
        const alreadyProcessed = await prisma.webhookEvent.findFirst({
          where: { stripeEventId: idempotencyKey },
        });
        if (alreadyProcessed) {
          console.log(`[PaymentRecovery] Payment ${payment.id} (session ${sessionId}) already recovered — skipping`);
          continue;
        }

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
          console.log(`[PaymentRecovery] Session ${sessionId} payment_status=${session.payment_status} — skipping`);
          continue;
        }

        const { tournamentId, userId } = session.metadata || {};
        if (!tournamentId || !userId) {
          console.warn(`[PaymentRecovery] Session ${sessionId} missing metadata — skipping`);
          continue;
        }

        // Update Payment, TournamentRegistration, and record idempotency atomically
        const ops: Prisma.PrismaPromise<unknown>[] = [
          prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'PAID' },
          }),
          prisma.webhookEvent.create({
            data: {
              stripeEventId: idempotencyKey,
              eventType: 'checkout.session.completed',
              status: 'recovered',
            },
          }),
        ];

        // Only update registration if tournamentId is available on the payment record
        if (payment.tournamentId) {
          ops.push(
            prisma.tournamentRegistration.update({
              where: { tournamentId_userId: { tournamentId: payment.tournamentId, userId } },
              data: { status: 'PAID' },
            }),
          );
        }

        await prisma.$transaction(ops);
        console.log(`[PaymentRecovery] Recovered payment ${payment.id} for user ${userId}, tournament ${tournamentId}`);
      } catch (err) {
        console.error(`[PaymentRecovery] Failed to process payment ${payment.id}:`, (err as Error).message);
        // Non-fatal: continue with next payment
      }
    }
  },
  { connection },
);

worker.on('completed', (job) => {
  console.log(`[PaymentRecovery] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[PaymentRecovery] Job ${job?.id} failed:`, err.message);
});
