import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import prisma from './prisma';
import { sendScheduleChangeEmail } from '../services/email.service';

// Dedicated Redis connection for BullMQ — do NOT reuse auth.service connections
const connection = new Redis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null });
connection.on('error', (err) => console.error('[ScheduleQueue] Redis error:', err.message));

const QUEUE_NAME = 'schedule-notifications';
const DELAY_MS = 15 * 60 * 1000; // 15 minutes

export const scheduleQueue = new Queue(QUEUE_NAME, { connection });

interface ScheduleJobData {
  tournamentId: string;
}

// Worker: runs when a delayed job fires
const worker = new Worker<ScheduleJobData>(
  QUEUE_NAME,
  async (job: Job<ScheduleJobData>) => {
    const { tournamentId } = job.data;

    // Tournament may have been deleted/cancelled in the 15-min window
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        startDate: true,
        endDate: true,
        status: true,
      },
    });

    if (!tournament) {
      console.log(`[ScheduleQueue] Tournament ${tournamentId} not found — skipping email`);
      return;
    }

    // Only notify if tournament is in a state where schedule is relevant
    if (['CANCELLED', 'COMPLETED'].includes(tournament.status)) {
      console.log(`[ScheduleQueue] Tournament ${tournamentId} is ${tournament.status} — skipping email`);
      return;
    }

    // Get all watchlisted users for this tournament
    const watchlistEntries = await prisma.tournamentWatchlist.findMany({
      where: { tournamentId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (watchlistEntries.length === 0) {
      console.log(`[ScheduleQueue] No watchers for tournament ${tournamentId}`);
      return;
    }

    console.log(`[ScheduleQueue] Sending schedule-change emails to ${watchlistEntries.length} watchers for tournament ${tournamentId}`);

    // Send emails — fire-and-forget per recipient, don't let one failure stop others
    const sendPromises = watchlistEntries.map(async (entry) => {
      try {
        await sendScheduleChangeEmail(
          entry.user.email,
          entry.user.name ?? entry.user.email,
          tournament,
        );
      } catch (err) {
        console.error(`[ScheduleQueue] Failed to send email to ${entry.user.email}:`, (err as Error).message);
      }
    });

    await Promise.allSettled(sendPromises);
  },
  { connection },
);

worker.on('completed', (job) => {
  console.log(`[ScheduleQueue] Job ${job.id} completed for tournament ${job.data.tournamentId}`);
});

worker.on('failed', (job, err) => {
  console.error(`[ScheduleQueue] Job ${job?.id} failed:`, err.message);
});

/**
 * Debounce schedule-change email notification for a tournament.
 * Cancels any existing pending delayed job for this tournament,
 * then enqueues a new one to fire in 15 minutes.
 */
export async function debounceScheduleEmail(tournamentId: string): Promise<void> {
  const jobId = `schedule-${tournamentId}`;

  try {
    // Remove existing delayed job if it exists
    const existingJob = await scheduleQueue.getJob(jobId);
    if (existingJob) {
      await existingJob.remove();
      console.log(`[ScheduleQueue] Removed existing delayed job ${jobId}`);
    }

    // Enqueue new delayed job
    await scheduleQueue.add(
      'schedule-changed',
      { tournamentId },
      {
        jobId,
        delay: DELAY_MS,
        removeOnComplete: true,
        removeOnFail: 5, // keep last 5 failed jobs for debugging
      },
    );

    console.log(`[ScheduleQueue] Enqueued schedule-change notification for tournament ${tournamentId} (delay: 15min)`);
  } catch (err) {
    // Non-fatal: log but don't crash the request
    console.error(`[ScheduleQueue] Failed to debounce schedule email for ${tournamentId}:`, (err as Error).message);
  }
}
