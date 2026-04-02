import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

export type NotificationType =
  | 'REGISTRATION_APPROVED'
  | 'REGISTRATION_REJECTED'
  | 'TOURNAMENT_OPEN';

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: data !== undefined ? (data as Prisma.InputJsonValue) : Prisma.DbNull,
      },
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
}
