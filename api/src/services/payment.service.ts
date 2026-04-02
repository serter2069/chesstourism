import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

let stripe: Stripe | null = null;

if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY);
} else {
  console.warn('STRIPE_SECRET_KEY not set — payment features will use placeholder mode');
}

export async function createStripeSession(
  userId: string,
  tournamentId: string,
  amount: number,
  currency: string,
): Promise<{ sessionUrl: string }> {
  // Find participant record
  const participant = await prisma.tournamentParticipant.findUnique({
    where: {
      tournament_id_user_id: { tournament_id: tournamentId, user_id: userId },
    },
    include: { tournament: true },
  });

  if (!participant) {
    throw new Error('Not registered for this tournament');
  }

  if (participant.paid) {
    throw new Error('Already paid for this tournament');
  }

  if (!stripe) {
    // Placeholder mode when Stripe is not configured
    console.warn('Stripe not configured — returning placeholder session URL');
    return { sessionUrl: `${BASE_URL}/payment-placeholder?tournament=${tournamentId}` };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Tournament Entry: ${participant.tournament.title}`,
            description: `Entry fee for ${participant.tournament.title}`,
          },
          unit_amount: Math.round(amount * 100), // Stripe expects cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      tournamentId,
      userId,
      participantId: participant.id,
    },
    success_url: `${BASE_URL}/tournaments/${tournamentId}?payment=success`,
    cancel_url: `${BASE_URL}/tournaments/${tournamentId}?payment=cancelled`,
  });

  // Create pending payment record
  await prisma.payment.create({
    data: {
      tournament_participant_id: participant.id,
      amount,
      currency: currency.toUpperCase(),
      provider: 'STRIPE',
      provider_payment_id: session.id,
      status: 'PENDING',
    },
  });

  return { sessionUrl: session.url! };
}

export async function handleWebhook(
  rawBody: Buffer,
  signature: string,
): Promise<void> {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe not configured');
  }

  const event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const participantId = session.metadata?.participantId;

    if (!participantId) {
      console.error('Webhook: missing participantId in metadata');
      return;
    }

    // Update payment status
    await prisma.payment.updateMany({
      where: {
        tournament_participant_id: participantId,
        provider_payment_id: session.id,
      },
      data: {
        status: 'COMPLETED',
      },
    });

    // Mark participant as paid
    await prisma.tournamentParticipant.update({
      where: { id: participantId },
      data: {
        paid: true,
        payment_method: 'ONLINE',
        payment_confirmed_at: new Date(),
      },
    });

    console.log(`Payment completed for participant ${participantId}`);
  }
}

export async function getPaymentStatus(
  userId: string,
  tournamentId: string,
): Promise<{ paid: boolean; status: string | null; provider: string | null }> {
  const participant = await prisma.tournamentParticipant.findUnique({
    where: {
      tournament_id_user_id: { tournament_id: tournamentId, user_id: userId },
    },
    include: { payment: true },
  });

  if (!participant) {
    throw new Error('Not registered for this tournament');
  }

  return {
    paid: participant.paid,
    status: participant.payment?.status ?? null,
    provider: participant.payment?.provider ?? null,
  };
}
