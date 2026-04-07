import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import {
  sendCommissarApproval,
  sendOrganizationRequestDecision,
  sendResultsWithCertificate,
  sendTournamentInvite,
  sendTournamentResults,
  sendThankYouEmail,
  sendScheduleChangeEmail,
  sendAnnouncementEmail,
  sendPaymentConfirmedEmail,
  sendTournamentCancelledEmail,
} from '../services/email.service';

// Dedicated Redis connection for BullMQ — do NOT reuse auth.service connections
const connection = new Redis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null });
connection.on('error', (err) => console.error('[EmailQueue] Redis error:', err.message));

export interface EmailJobData {
  type:
    | 'commissar_approval'
    | 'organization_request_decision'
    | 'results_with_certificate'
    | 'tournament_invite'
    | 'tournament_results'
    | 'thank_you'
    | 'schedule_change'
    | 'announcement'
    | 'payment_confirmed'
    | 'tournament_cancelled';
  to: string;
  payload: Record<string, unknown>;
}

export const emailQueue = new Queue<EmailJobData>('email', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5 * 60 * 1000 }, // 5 min base
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

/**
 * Enqueue a non-critical email for async delivery with retry.
 * OTP emails must NOT go through this queue — they are time-sensitive.
 */
export async function enqueueEmail(
  type: EmailJobData['type'],
  to: string,
  payload: Record<string, unknown>,
): Promise<void> {
  await emailQueue.add(type, { type, to, payload });
}

// Worker: dispatches jobs to existing email.service functions
export const emailWorker = new Worker<EmailJobData>(
  'email',
  async (job: Job<EmailJobData>) => {
    const { type, to, payload } = job.data;

    switch (type) {
      case 'commissar_approval':
        await sendCommissarApproval(
          to,
          payload.userName as string,
          payload.approved as boolean,
          payload.comment as string | undefined,
        );
        break;

      case 'organization_request_decision':
        await sendOrganizationRequestDecision(
          to,
          payload.contactName as string,
          payload.organizationName as string,
          payload.approved as boolean,
          payload.reason as string | undefined,
        );
        break;

      case 'results_with_certificate':
        await sendResultsWithCertificate(
          to,
          payload.userName as string,
          payload.tournamentName as string,
          payload.place as number,
          payload.eloChange as number,
          Buffer.from(payload.certificatePdfBase64 as string, 'base64'),
        );
        break;

      case 'tournament_invite':
        await sendTournamentInvite(
          to,
          payload.userName as string,
          payload.tournamentName as string,
          payload.tournamentDate as string,
          payload.registrationUrl as string,
        );
        break;

      case 'tournament_results':
        await sendTournamentResults(
          to,
          payload.userName as string,
          payload.tournamentName as string,
          payload.place as number,
          payload.eloChange as number,
        );
        break;

      case 'thank_you':
        await sendThankYouEmail(
          to,
          payload.userName as string,
          payload.tournamentName as string,
        );
        break;

      case 'schedule_change':
        await sendScheduleChangeEmail(
          to,
          payload.userName as string,
          {
            id: payload.tournamentId as string,
            title: payload.tournamentTitle as string,
            city: payload.city as string,
            country: payload.country as string,
            startDate: new Date(payload.startDate as string),
            endDate: new Date(payload.endDate as string),
          },
        );
        break;

      case 'announcement':
        await sendAnnouncementEmail(
          to,
          payload.tournamentTitle as string,
          payload.announcementTitle as string,
          payload.body as string,
        );
        break;

      case 'payment_confirmed':
        await sendPaymentConfirmedEmail(
          to,
          payload.userName as string,
          payload.tournamentTitle as string,
          payload.tournamentId as string,
        );
        break;

      case 'tournament_cancelled':
        await sendTournamentCancelledEmail(
          to,
          payload.userName as string,
          payload.tournamentTitle as string,
          payload.commissionerEmail as string,
        );
        break;

      default:
        console.error('[EmailQueue] Unknown email type:', (job.data as EmailJobData).type);
    }
  },
  { connection },
);

emailWorker.on('completed', (job) => {
  console.log(`[EmailQueue] Job ${job.id} (${job.data.type}) completed for ${job.data.to}`);
});

emailWorker.on('failed', (job, err) => {
  if (job) {
    const maxAttempts = job.opts.attempts ?? 3;
    if (job.attemptsMade >= maxAttempts) {
      // Dead-letter logging: final failure after all retries exhausted
      console.error(
        `[EmailQueue] DEAD LETTER — type=${job.data.type} to=${job.data.to} attempts=${job.attemptsMade}: ${err.message}`,
      );
    } else {
      console.warn(
        `[EmailQueue] Job ${job.id} failed (attempt ${job.attemptsMade}/${maxAttempts}): ${err.message}`,
      );
    }
  }
});
