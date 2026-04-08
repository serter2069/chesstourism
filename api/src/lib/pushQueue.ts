import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { sendPushNotification } from '../services/push.service';

// Dedicated Redis connection for BullMQ — do NOT reuse auth.service connections
const connection = new Redis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null });
connection.on('error', (err) => console.error('[PushQueue] Redis error:', err.message));

export interface PushJobData {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export const pushQueue = new Queue<PushJobData>('push', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5 * 60 * 1000 }, // 5 min base
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

/**
 * Enqueue an FCM push notification for async delivery with retry.
 */
export async function enqueuePush(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<void> {
  await pushQueue.add('push', { token, title, body, data });
}

// Worker: dispatches jobs to push.service
export const pushWorker = new Worker<PushJobData>(
  'push',
  async (job: Job<PushJobData>) => {
    const { token, title, body, data } = job.data;
    await sendPushNotification(token, title, body, data);
  },
  { connection },
);

pushWorker.on('completed', (job) => {
  console.log(`[PushQueue] Job ${job.id} completed — token ...${job.data.token.slice(-8)}`);
});

pushWorker.on('failed', (job, err) => {
  if (job) {
    const maxAttempts = job.opts.attempts ?? 3;
    if (job.attemptsMade >= maxAttempts) {
      // Dead-letter logging: final failure after all retries exhausted
      console.error(
        `[PushQueue] DEAD LETTER — token=...${job.data.token.slice(-8)} attempts=${job.attemptsMade}: ${err.message}`,
      );
    } else {
      console.warn(
        `[PushQueue] Job ${job.id} failed (attempt ${job.attemptsMade}/${maxAttempts}): ${err.message}`,
      );
    }
  }
});
