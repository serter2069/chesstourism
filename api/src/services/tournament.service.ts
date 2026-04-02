import { PrismaClient, TournamentStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Valid status transitions (forward only, CANCELLED from any)
const STATUS_ORDER: TournamentStatus[] = [
  'DRAFT',
  'REGISTRATION_OPEN',
  'REGISTRATION_CLOSED',
  'IN_PROGRESS',
  'COMPLETED',
];

export function isValidStatusTransition(
  current: TournamentStatus,
  next: TournamentStatus,
): boolean {
  if (next === 'CANCELLED') return true;
  if (current === 'CANCELLED' || current === 'COMPLETED') return false;

  const currentIdx = STATUS_ORDER.indexOf(current);
  const nextIdx = STATUS_ORDER.indexOf(next);

  return nextIdx > currentIdx;
}

interface CreateTournamentData {
  title: string;
  description?: string;
  format: 'CLASSICAL' | 'RAPID' | 'BLITZ';
  start_date: string;
  end_date: string;
  city: string;
  country: string;
  venue_address?: string;
  max_participants?: number;
  entry_fee?: number;
  currency?: string;
  rules?: string;
  schedule?: string;
}

export async function createTournament(commissarId: string, data: CreateTournamentData) {
  return prisma.tournament.create({
    data: {
      title: data.title,
      description: data.description,
      format: data.format,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      city: data.city,
      country: data.country,
      venue_address: data.venue_address,
      max_participants: data.max_participants,
      entry_fee: data.entry_fee,
      currency: data.currency || 'USD',
      rules: data.rules,
      schedule: data.schedule,
      commissar_id: commissarId,
      status: 'DRAFT',
    },
    include: {
      commissar: {
        select: { id: true, name: true, surname: true },
      },
    },
  });
}

export async function updateTournament(
  tournamentId: string,
  commissarId: string,
  data: Partial<CreateTournamentData>,
) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) throw new Error('Tournament not found');
  if (tournament.commissar_id !== commissarId) throw new Error('Not tournament owner');
  if (!['DRAFT', 'REGISTRATION_OPEN'].includes(tournament.status)) {
    throw new Error('Tournament can only be edited in DRAFT or REGISTRATION_OPEN status');
  }

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.format !== undefined) updateData.format = data.format;
  if (data.start_date !== undefined) updateData.start_date = new Date(data.start_date);
  if (data.end_date !== undefined) updateData.end_date = new Date(data.end_date);
  if (data.city !== undefined) updateData.city = data.city;
  if (data.country !== undefined) updateData.country = data.country;
  if (data.venue_address !== undefined) updateData.venue_address = data.venue_address;
  if (data.max_participants !== undefined) updateData.max_participants = data.max_participants;
  if (data.entry_fee !== undefined) updateData.entry_fee = data.entry_fee;
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.rules !== undefined) updateData.rules = data.rules;
  if (data.schedule !== undefined) updateData.schedule = data.schedule;

  return prisma.tournament.update({
    where: { id: tournamentId },
    data: updateData,
    include: {
      commissar: {
        select: { id: true, name: true, surname: true },
      },
    },
  });
}

export async function changeStatus(
  tournamentId: string,
  commissarId: string,
  newStatus: TournamentStatus,
) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) throw new Error('Tournament not found');
  if (tournament.commissar_id !== commissarId) throw new Error('Not tournament owner');

  if (!isValidStatusTransition(tournament.status, newStatus)) {
    throw new Error(
      `Invalid status transition: ${tournament.status} -> ${newStatus}`,
    );
  }

  return prisma.tournament.update({
    where: { id: tournamentId },
    data: { status: newStatus },
  });
}

interface ListTournamentsFilters {
  status?: string;
  country?: string;
  city?: string;
  format?: string;
  from?: string;
  to?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function listTournaments(filters: ListTournamentsFilters) {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  // Public listing excludes drafts
  where.status = { not: 'DRAFT' as TournamentStatus };

  if (filters.status) {
    where.status = filters.status as TournamentStatus;
  }
  if (filters.country) where.country = filters.country;
  if (filters.city) where.city = filters.city;
  if (filters.format) where.format = filters.format;

  if (filters.from || filters.to) {
    where.start_date = {} as Record<string, unknown>;
    if (filters.from) (where.start_date as Record<string, unknown>).gte = new Date(filters.from);
    if (filters.to) (where.start_date as Record<string, unknown>).lte = new Date(filters.to);
  }

  const orderBy: Record<string, string> = {};
  if (filters.sort === 'date') {
    orderBy.start_date = 'asc';
  } else {
    orderBy.start_date = 'desc';
  }

  const [tournaments, total] = await Promise.all([
    prisma.tournament.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        commissar: {
          select: { id: true, name: true, surname: true },
        },
        _count: {
          select: { participants: true },
        },
      },
    }),
    prisma.tournament.count({ where }),
  ]);

  return {
    data: tournaments.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      format: t.format,
      status: t.status,
      start_date: t.start_date,
      end_date: t.end_date,
      city: t.city,
      country: t.country,
      venue_address: t.venue_address,
      max_participants: t.max_participants,
      entry_fee: t.entry_fee,
      currency: t.currency,
      hero_image_url: t.hero_image_url,
      commissar: t.commissar,
      participant_count: t._count.participants,
      created_at: t.created_at,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTournamentById(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      commissar: {
        select: { id: true, name: true, surname: true, country: true, city: true },
      },
      _count: {
        select: { participants: true },
      },
    },
  });

  if (!tournament) throw new Error('Tournament not found');

  const { _count, ...rest } = tournament;
  return {
    ...rest,
    participant_count: _count.participants,
  };
}

export async function getParticipants(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });
  if (!tournament) throw new Error('Tournament not found');

  return prisma.tournamentParticipant.findMany({
    where: { tournament_id: tournamentId },
    orderBy: { registered_at: 'asc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          surname: true,
          country: true,
        },
      },
    },
  });
}

export async function getResults(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) throw new Error('Tournament not found');
  if (tournament.status !== 'COMPLETED') {
    throw new Error('Results are only available for completed tournaments');
  }

  return prisma.tournamentResult.findMany({
    where: { tournament_id: tournamentId },
    orderBy: { place: 'asc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          surname: true,
        },
      },
    },
  });
}

export async function getPhotos(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });
  if (!tournament) throw new Error('Tournament not found');

  return prisma.tournamentPhoto.findMany({
    where: { tournament_id: tournamentId },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      url: true,
      created_at: true,
    },
  });
}

export async function registerParticipant(tournamentId: string, userId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: { _count: { select: { participants: true } } },
  });

  if (!tournament) throw new Error('Tournament not found');
  if (tournament.status !== 'REGISTRATION_OPEN') {
    throw new Error('Tournament registration is not open');
  }
  if (tournament.commissar_id === userId) {
    throw new Error('Commissar cannot register as participant in own tournament');
  }
  if (tournament.max_participants && tournament._count.participants >= tournament.max_participants) {
    throw new Error('Tournament is full');
  }

  // Check not already registered
  const existing = await prisma.tournamentParticipant.findUnique({
    where: {
      tournament_id_user_id: {
        tournament_id: tournamentId,
        user_id: userId,
      },
    },
  });

  if (existing) throw new Error('Already registered for this tournament');

  return prisma.tournamentParticipant.create({
    data: {
      tournament_id: tournamentId,
      user_id: userId,
    },
  });
}

export async function cancelRegistration(tournamentId: string, userId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) throw new Error('Tournament not found');
  if (tournament.status !== 'REGISTRATION_OPEN') {
    throw new Error('Can only cancel registration while registration is open');
  }

  const participant = await prisma.tournamentParticipant.findUnique({
    where: {
      tournament_id_user_id: {
        tournament_id: tournamentId,
        user_id: userId,
      },
    },
  });

  if (!participant) throw new Error('Not registered for this tournament');

  return prisma.tournamentParticipant.delete({
    where: { id: participant.id },
  });
}

interface ResultEntry {
  userId: string;
  place: number;
  score: number;
}

export async function submitResults(
  tournamentId: string,
  commissarId: string,
  results: ResultEntry[],
) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) throw new Error('Tournament not found');
  if (tournament.commissar_id !== commissarId) throw new Error('Not tournament owner');
  if (tournament.status !== 'IN_PROGRESS') {
    throw new Error('Results can only be submitted for in-progress tournaments');
  }

  // Create results and transition status to COMPLETED in a transaction
  return prisma.$transaction(async (tx) => {
    // Delete existing results if any (allows re-submission)
    await tx.tournamentResult.deleteMany({
      where: { tournament_id: tournamentId },
    });

    // Create result records
    for (const entry of results) {
      // Get current ELO for the user
      const rating = await tx.rating.findUnique({
        where: { user_id: entry.userId },
      });

      const eloBefore = rating?.elo || 1200;

      // ELO calculation placeholder: +10 for 1st, +5 for 2nd, +2 for 3rd, 0 otherwise
      let eloChange = 0;
      if (entry.place === 1) eloChange = 10;
      else if (entry.place === 2) eloChange = 5;
      else if (entry.place === 3) eloChange = 2;

      const eloAfter = eloBefore + eloChange;

      await tx.tournamentResult.create({
        data: {
          tournament_id: tournamentId,
          user_id: entry.userId,
          place: entry.place,
          score: entry.score,
          elo_change: eloChange,
          elo_before: eloBefore,
          elo_after: eloAfter,
        },
      });

      // Update rating if exists
      if (rating) {
        await tx.rating.update({
          where: { user_id: entry.userId },
          data: {
            elo: eloAfter,
            peak_elo: Math.max(rating.peak_elo, eloAfter),
            games_played: { increment: 1 },
          },
        });
      }
    }

    // Transition tournament to COMPLETED
    return tx.tournament.update({
      where: { id: tournamentId },
      data: { status: 'COMPLETED' },
    });
  });
}

export async function uploadPhoto(
  tournamentId: string,
  commissarId: string,
  url: string,
) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) throw new Error('Tournament not found');
  if (tournament.commissar_id !== commissarId) throw new Error('Not tournament owner');

  return prisma.tournamentPhoto.create({
    data: {
      tournament_id: tournamentId,
      url,
      uploaded_by: commissarId,
    },
  });
}

export async function listAllTournaments(filters: ListTournamentsFilters) {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status as TournamentStatus;
  if (filters.country) where.country = filters.country;

  const [tournaments, total] = await Promise.all([
    prisma.tournament.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        commissar: {
          select: { id: true, name: true, surname: true },
        },
        _count: {
          select: { participants: true },
        },
      },
    }),
    prisma.tournament.count({ where }),
  ]);

  return {
    data: tournaments,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getHeroSettings() {
  const settings = await prisma.heroSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    return {
      title: 'International Chess Tourism',
      subtitle: null,
      image_url: null,
      button_text: 'Find Tournaments',
    };
  }
  return settings;
}

export async function updateHeroSettings(data: {
  title?: string;
  subtitle?: string;
  image_url?: string;
  button_text?: string;
}) {
  return prisma.heroSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      title: data.title || 'International Chess Tourism',
      subtitle: data.subtitle,
      image_url: data.image_url,
      button_text: data.button_text || 'Find Tournaments',
    },
    update: data,
  });
}
