import { PrismaClient } from '@prisma/client';
import { calculateEloChanges, TournamentResultEntry } from './elo.service';
import { generateCertificate } from './pdf.service';
import { sendResultsWithCertificate } from './email.service';

const prisma = new PrismaClient();

export interface ResultInput {
  userId: string;
  place: number;
  score: number;
}

/**
 * Submit tournament results: validate state, create results, calculate ELO,
 * update user ratings, transition to COMPLETED, fire-and-forget certificate emails for top-3.
 */
export async function submitResults(
  tournamentId: string,
  results: ResultInput[],
): Promise<{
  results: Array<{ userId: string; place: number; score: number; eloChange: number }>;
  eloChanges: Array<{ userId: string; eloBefore: number; eloAfter: number; eloChange: number }>;
}> {
  // 1. Validate tournament exists and is IN_PROGRESS
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    throw new AppError('Tournament not found', 404);
  }

  if (tournament.status !== 'IN_PROGRESS') {
    throw new AppError(
      `Cannot submit results: tournament status is ${tournament.status}, expected IN_PROGRESS`,
      400,
    );
  }

  // 2. Validate no duplicate users and places
  const userIds = results.map((r) => r.userId);
  const uniqueUserIds = new Set(userIds);
  if (uniqueUserIds.size !== userIds.length) {
    throw new AppError('Duplicate userId in results', 400);
  }

  const places = results.map((r) => r.place);
  const uniquePlaces = new Set(places);
  if (uniquePlaces.size !== places.length) {
    throw new AppError('Duplicate place in results', 400);
  }

  // 3. Validate all users exist and have approved registrations
  const registrations = await prisma.tournamentRegistration.findMany({
    where: {
      tournamentId,
      userId: { in: userIds },
      status: 'APPROVED',
    },
    select: { userId: true },
  });

  const registeredUserIds = new Set(registrations.map((r) => r.userId));
  const unregistered = userIds.filter((id) => !registeredUserIds.has(id));
  if (unregistered.length > 0) {
    throw new AppError(
      `Users not registered/approved for this tournament: ${unregistered.join(', ')}`,
      400,
    );
  }

  // 4. Get current ratings for ELO calculation
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, rating: true, name: true, email: true },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));
  const currentRatings = new Map(users.map((u) => [u.id, u.rating]));

  // 5. Calculate ELO changes
  const sortedResults: TournamentResultEntry[] = [...results].sort((a, b) => a.place - b.place);
  const eloChanges = calculateEloChanges(sortedResults, currentRatings);
  const eloMap = new Map(eloChanges.map((e) => [e.userId, e]));

  // 6. Create results, update ratings, transition to COMPLETED — all in a transaction
  await prisma.$transaction(async (tx) => {
    // Create TournamentResult records
    await tx.tournamentResult.createMany({
      data: sortedResults.map((r) => ({
        tournamentId,
        userId: r.userId,
        place: r.place,
        score: r.score,
        eloChange: eloMap.get(r.userId)?.eloChange ?? 0,
      })),
    });

    // Update user ratings
    for (const change of eloChanges) {
      await tx.user.update({
        where: { id: change.userId },
        data: { rating: change.eloAfter },
      });
    }

    // Transition tournament to COMPLETED
    await tx.tournament.update({
      where: { id: tournamentId },
      data: { status: 'COMPLETED' },
    });
  });

  // 7. Fire-and-forget: send certificate emails to top-3
  const top3 = sortedResults.filter((r) => r.place <= 3);
  const tournamentDate = tournament.startDate.toISOString().split('T')[0];

  for (const entry of top3) {
    const user = userMap.get(entry.userId);
    const elo = eloMap.get(entry.userId);
    if (!user || !elo) continue;

    // Fire-and-forget per recipient
    (async () => {
      try {
        const pdfBuffer = await generateCertificate(
          user.name || 'Participant',
          tournament.title,
          entry.place,
          tournamentDate,
        );

        await sendResultsWithCertificate(
          user.email,
          user.name || 'Participant',
          tournament.title,
          entry.place,
          elo.eloChange,
          pdfBuffer,
        );

        console.log(`Certificate email sent to ${user.email} for place ${entry.place}`);
      } catch (err) {
        console.error(`Failed to send certificate to ${user.email}:`, err);
      }
    })();
  }

  // 8. Return results summary
  return {
    results: sortedResults.map((r) => ({
      userId: r.userId,
      place: r.place,
      score: r.score,
      eloChange: eloMap.get(r.userId)?.eloChange ?? 0,
    })),
    eloChanges: eloChanges.map((e) => ({
      userId: e.userId,
      eloBefore: e.eloBefore,
      eloAfter: e.eloAfter,
      eloChange: e.eloChange,
    })),
  };
}

/**
 * Get tournament results (only for COMPLETED tournaments).
 */
export async function getResults(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { id: true, status: true },
  });

  if (!tournament) {
    throw new AppError('Tournament not found', 404);
  }

  if (tournament.status !== 'COMPLETED') {
    throw new AppError('Results are only available for completed tournaments', 400);
  }

  return prisma.tournamentResult.findMany({
    where: { tournamentId },
    orderBy: { place: 'asc' },
    include: {
      user: {
        select: { id: true, name: true, rating: true, city: true },
      },
    },
  });
}

// Simple error class with HTTP status
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
