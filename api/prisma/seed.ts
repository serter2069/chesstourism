/**
 * Comprehensive seed script for chesstourism database.
 * Idempotent — safe to run multiple times (uses upsert).
 *
 * Creates: 40 users, 8 commissioners, 12 tournaments, ~200 registrations,
 * tournament results, payments, photos (MinIO), notifications, memberships,
 * organization requests.
 */

import { PrismaClient, Role, TournamentStatus, RegistrationStatus, PaymentStatus, RequestStatus, MembershipStatus } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as https from 'https';
import * as http from 'http';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// ─── MinIO / S3 ───────────────────────────────────────────

const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT || 'https://s3.smartlaunchhub.com';
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'chesstourism';
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;
const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY;
const STORAGE_REGION = process.env.STORAGE_REGION || 'us-east-1';

let s3Client: S3Client | null = null;
if (STORAGE_ACCESS_KEY && STORAGE_SECRET_KEY) {
  s3Client = new S3Client({
    endpoint: STORAGE_ENDPOINT,
    region: STORAGE_REGION,
    credentials: {
      accessKeyId: STORAGE_ACCESS_KEY,
      secretAccessKey: STORAGE_SECRET_KEY,
    },
    forcePathStyle: true,
  });
}

async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'chesstourism-seed/1.0' } }, (res) => {
      // Follow redirects (picsum returns 302)
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadToMinIO(buffer: Buffer, key: string): Promise<string> {
  if (!s3Client) {
    console.warn('  MinIO not configured, using placeholder URL');
    return `${STORAGE_ENDPOINT}/${STORAGE_BUCKET}/${key}`;
  }
  await s3Client.send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    }),
  );
  return `${STORAGE_ENDPOINT}/${STORAGE_BUCKET}/${key}`;
}

// ─── Helpers ──────────────────────────────────────────────

function normalRandom(mean: number, stddev: number): number {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.round(mean + z * stddev);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// ─── Data ─────────────────────────────────────────────────

interface PlayerDef {
  name: string;
  country: string;
  city: string;
  rating: number;
  fideId?: string;
  fideTitle?: string;
  fideRating?: number;
  isCommissioner?: boolean;
}

const PLAYERS: PlayerDef[] = [
  // Russia
  { name: 'Alexei Petrov', country: 'Russia', city: 'Moscow', rating: 2540, fideId: '4100018', fideTitle: 'GM', fideRating: 2545 },
  { name: 'Dmitry Sokolov', country: 'Russia', city: 'Saint Petersburg', rating: 2380, fideId: '4100026', fideTitle: 'IM', fideRating: 2385 },
  { name: 'Mikhail Ivanov', country: 'Russia', city: 'Kazan', rating: 1850 },
  { name: 'Sergei Volkov', country: 'Russia', city: 'Novosibirsk', rating: 1620 },
  { name: 'Andrei Kuznetsov', country: 'Russia', city: 'Moscow', rating: 1380 },
  // Germany
  { name: 'Klaus Weber', country: 'Germany', city: 'Berlin', rating: 2210, fideId: '4600010', fideTitle: 'FM', fideRating: 2215, isCommissioner: true },
  { name: 'Hans Mueller', country: 'Germany', city: 'Munich', rating: 1750 },
  { name: 'Stefan Schmidt', country: 'Germany', city: 'Hamburg', rating: 1480 },
  { name: 'Thomas Fischer', country: 'Germany', city: 'Frankfurt', rating: 1320 },
  // France
  { name: 'Pierre Dupont', country: 'France', city: 'Paris', rating: 2150, fideId: '6100015', fideTitle: 'FM', fideRating: 2155, isCommissioner: true },
  { name: 'Jean-Luc Martin', country: 'France', city: 'Lyon', rating: 1680 },
  { name: 'Olivier Bernard', country: 'France', city: 'Marseille', rating: 1410 },
  { name: 'Antoine Moreau', country: 'France', city: 'Nice', rating: 1290 },
  // Spain
  { name: 'Carlos Garcia', country: 'Spain', city: 'Madrid', rating: 2450, fideId: '2200011', fideTitle: 'IM', fideRating: 2460, isCommissioner: true },
  { name: 'Miguel Rodriguez', country: 'Spain', city: 'Barcelona', rating: 1920 },
  { name: 'Javier Lopez', country: 'Spain', city: 'Valencia', rating: 1560 },
  { name: 'Fernando Torres', country: 'Spain', city: 'Seville', rating: 1340 },
  // USA
  { name: 'James Wilson', country: 'USA', city: 'New York', rating: 2310, fideId: '2000014', fideTitle: 'FM', fideRating: 2320, isCommissioner: true },
  { name: 'Robert Johnson', country: 'USA', city: 'Los Angeles', rating: 1790 },
  { name: 'Michael Davis', country: 'USA', city: 'Chicago', rating: 1540 },
  { name: 'William Brown', country: 'USA', city: 'San Francisco', rating: 1350 },
  { name: 'David Miller', country: 'USA', city: 'Boston', rating: 1180 },
  // China
  { name: 'Wei Zhang', country: 'China', city: 'Beijing', rating: 2580, fideId: '8600013', fideTitle: 'GM', fideRating: 2590 },
  { name: 'Chen Li', country: 'China', city: 'Shanghai', rating: 2100, fideId: '8600021', fideTitle: 'CM', fideRating: 2110, isCommissioner: true },
  { name: 'Hao Wang', country: 'China', city: 'Guangzhou', rating: 1660 },
  { name: 'Jian Liu', country: 'China', city: 'Shenzhen', rating: 1420 },
  // India
  { name: 'Arjun Sharma', country: 'India', city: 'Mumbai', rating: 2490, fideId: '5000019', fideTitle: 'GM', fideRating: 2500 },
  { name: 'Ravi Patel', country: 'India', city: 'Delhi', rating: 2050, fideId: '5000027', fideTitle: 'CM', fideRating: 2060, isCommissioner: true },
  { name: 'Vikram Singh', country: 'India', city: 'Bangalore', rating: 1700 },
  { name: 'Anil Kumar', country: 'India', city: 'Chennai', rating: 1450 },
  { name: 'Pradeep Gupta', country: 'India', city: 'Kolkata', rating: 1280 },
  // Brazil
  { name: 'Lucas Oliveira', country: 'Brazil', city: 'Sao Paulo', rating: 2260, fideId: '2100017', fideTitle: 'IM', fideRating: 2265, isCommissioner: true },
  { name: 'Gabriel Santos', country: 'Brazil', city: 'Rio de Janeiro', rating: 1830 },
  { name: 'Mateus Silva', country: 'Brazil', city: 'Brasilia', rating: 1550 },
  { name: 'Pedro Costa', country: 'Brazil', city: 'Salvador', rating: 1370 },
  // Extra filler players
  { name: 'Erik Johansson', country: 'Sweden', city: 'Stockholm', rating: 1690, isCommissioner: true },
  { name: 'Yuki Tanaka', country: 'Japan', city: 'Tokyo', rating: 1870 },
  { name: 'Omar Hassan', country: 'Egypt', city: 'Cairo', rating: 1520 },
  { name: 'Liam OConnor', country: 'Ireland', city: 'Dublin', rating: 1360 },
  { name: 'Marco Rossi', country: 'Italy', city: 'Rome', rating: 1730 },
];

interface TournamentDef {
  title: string;
  city: string;
  country: string;
  status: TournamentStatus;
  format: string; // stored in timeControl
  fee: number;
  currency: string;
  maxParticipants: number;
  daysOffset: [number, number]; // [startDaysAgo, endDaysAgo] negative = future
  description: string;
  ratingLimit?: number;
}

const TOURNAMENTS: TournamentDef[] = [
  // COMPLETED (3)
  {
    title: 'Moscow Winter Classical',
    city: 'Moscow', country: 'Russia',
    status: TournamentStatus.COMPLETED,
    format: 'CLASSICAL 90+30',
    fee: 50, currency: 'USD', maxParticipants: 32,
    daysOffset: [90, 80],
    description: 'Traditional winter classical tournament in the heart of Moscow. 9 rounds Swiss system.',
  },
  {
    title: 'Barcelona Rapid Open',
    city: 'Barcelona', country: 'Spain',
    status: TournamentStatus.COMPLETED,
    format: 'RAPID 15+10',
    fee: 30, currency: 'EUR', maxParticipants: 64,
    daysOffset: [60, 58],
    description: 'Open rapid tournament with beautiful Mediterranean views. 7 rounds Swiss.',
  },
  {
    title: 'Beijing International Blitz',
    city: 'Beijing', country: 'China',
    status: TournamentStatus.COMPLETED,
    format: 'BLITZ 3+2',
    fee: 25, currency: 'USD', maxParticipants: 48,
    daysOffset: [45, 44],
    description: 'Fast-paced blitz championship attracting top Asian players. 11 rounds Swiss.',
  },
  {
    title: 'Paris Spring Classic',
    city: 'Paris', country: 'France',
    status: TournamentStatus.COMPLETED,
    format: 'CLASSICAL 60+30',
    fee: 40, currency: 'EUR', maxParticipants: 24,
    daysOffset: [30, 25],
    description: 'Elegant classical tournament at a historic Parisian chess club. 7 rounds Swiss.',
  },
  // IN_PROGRESS (3)
  {
    title: 'Berlin Championship 2026',
    city: 'Berlin', country: 'Germany',
    status: TournamentStatus.IN_PROGRESS,
    format: 'CLASSICAL 90+30',
    fee: 60, currency: 'EUR', maxParticipants: 32,
    daysOffset: [3, -4],
    description: 'Annual Berlin chess championship. Round-robin format for top 32 players.',
  },
  {
    title: 'Mumbai Rapid Festival',
    city: 'Mumbai', country: 'India',
    status: TournamentStatus.IN_PROGRESS,
    format: 'RAPID 25+10',
    fee: 20, currency: 'USD', maxParticipants: 64,
    daysOffset: [2, -3],
    description: 'India\'s premier rapid chess festival with players from across Asia.',
  },
  {
    title: 'Sao Paulo Blitz Marathon',
    city: 'Sao Paulo', country: 'Brazil',
    status: TournamentStatus.IN_PROGRESS,
    format: 'BLITZ 5+3',
    fee: 15, currency: 'USD', maxParticipants: 48,
    daysOffset: [1, -2],
    description: 'Non-stop blitz action over 3 days. 15 rounds Swiss system.',
  },
  // REGISTRATION_OPEN (3)
  {
    title: 'New York Open 2026',
    city: 'New York', country: 'USA',
    status: TournamentStatus.REGISTRATION_OPEN,
    format: 'CLASSICAL 90+30',
    fee: 75, currency: 'USD', maxParticipants: 48,
    daysOffset: [-14, -21],
    description: 'Premier American chess open. $10,000 prize fund. FIDE-rated event.',
    ratingLimit: 2600,
  },
  {
    title: 'Tokyo Cherry Blossom Rapid',
    city: 'Tokyo', country: 'Japan',
    status: TournamentStatus.REGISTRATION_OPEN,
    format: 'RAPID 15+10',
    fee: 35, currency: 'USD', maxParticipants: 64,
    daysOffset: [-20, -23],
    description: 'Play chess surrounded by cherry blossoms. Open to all ratings.',
  },
  {
    title: 'Stockholm Nordic Blitz',
    city: 'Stockholm', country: 'Sweden',
    status: TournamentStatus.REGISTRATION_OPEN,
    format: 'BLITZ 3+2',
    fee: 20, currency: 'EUR', maxParticipants: 32,
    daysOffset: [-25, -26],
    description: 'Fast blitz tournament in the Nordic capital. Prize for top U1800.',
    ratingLimit: 2400,
  },
  // UPCOMING (2) — use PUBLISHED status since no UPCOMING enum
  {
    title: 'Dubai Grand Prix 2026',
    city: 'Dubai', country: 'UAE',
    status: TournamentStatus.PUBLISHED,
    format: 'CLASSICAL 90+30',
    fee: 100, currency: 'USD', maxParticipants: 24,
    daysOffset: [-60, -68],
    description: 'Luxury chess event at the Dubai Chess Club. Invitation + qualification.',
    ratingLimit: 2200,
  },
  {
    title: 'Rome Summer Bullet',
    city: 'Rome', country: 'Italy',
    status: TournamentStatus.PUBLISHED,
    format: 'BULLET 1+1',
    fee: 10, currency: 'EUR', maxParticipants: 64,
    daysOffset: [-45, -46],
    description: 'Ultra-fast bullet tournament in the Eternal City. Fun atmosphere guaranteed.',
  },
];

const NOTIFICATION_TYPES = [
  { type: 'REGISTRATION_APPROVED', title: 'Registration Approved', body: 'Your registration for {tournament} has been approved.' },
  { type: 'REGISTRATION_REJECTED', title: 'Registration Rejected', body: 'Your registration for {tournament} has been rejected.' },
  { type: 'TOURNAMENT_OPEN', title: 'Tournament Open', body: '{tournament} is now open for registration!' },
  { type: 'TOURNAMENT_OPEN', title: 'New Tournament', body: 'Check out {tournament} — a new tournament in your area.' },
  { type: 'REGISTRATION_APPROVED', title: 'Payment Confirmed', body: 'Payment for {tournament} has been received.' },
];

// ─── Seed Functions ───────────────────────────────────────

async function seedUsers(): Promise<Map<string, string>> {
  console.log('Seeding users...');
  const emailToId = new Map<string, string>();

  for (const p of PLAYERS) {
    const nameParts = p.name.toLowerCase().split(' ');
    const email = `${nameParts[0]}.${nameParts[nameParts.length - 1]}@gmail.com`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: p.name,
        city: p.city,
        rating: p.rating,
        fideId: p.fideId || null,
        fideTitle: p.fideTitle || null,
        fideRating: p.fideRating || null,
        onboardingCompleted: true,
      },
      create: {
        email,
        name: p.name,
        city: p.city,
        rating: p.rating,
        role: p.isCommissioner ? Role.COMMISSIONER : Role.PARTICIPANT,
        fideId: p.fideId || null,
        fideTitle: p.fideTitle || null,
        fideRating: p.fideRating || null,
        onboardingCompleted: true,
      },
    });

    emailToId.set(email, user.id);
  }

  console.log(`  Created/updated ${PLAYERS.length} users`);
  return emailToId;
}

async function seedCommissioners(emailToId: Map<string, string>): Promise<Map<string, string>> {
  console.log('Seeding commissioners...');
  const commissionerMap = new Map<string, string>(); // country -> commissionerId

  const commissioners = PLAYERS.filter(p => p.isCommissioner);

  for (const p of commissioners) {
    const nameParts = p.name.toLowerCase().split(' ');
    const email = `${nameParts[0]}.${nameParts[nameParts.length - 1]}@gmail.com`;
    const userId = emailToId.get(email)!;

    const comm = await prisma.commissioner.upsert({
      where: { userId },
      update: {
        bio: `Experienced chess organizer from ${p.city}, ${p.country}. Specializing in international tournaments.`,
        specialization: p.fideTitle ? 'International Events' : 'Regional Events',
        country: p.country,
        city: p.city,
        isVerified: true,
      },
      create: {
        userId,
        bio: `Experienced chess organizer from ${p.city}, ${p.country}. Specializing in international tournaments.`,
        specialization: p.fideTitle ? 'International Events' : 'Regional Events',
        country: p.country,
        city: p.city,
        isVerified: true,
      },
    });

    commissionerMap.set(p.country, comm.id);
  }

  console.log(`  Created/updated ${commissioners.length} commissioners`);
  return commissionerMap;
}

async function seedTournaments(commissionerMap: Map<string, string>): Promise<{ id: string; def: TournamentDef }[]> {
  console.log('Seeding tournaments...');
  const results: { id: string; def: TournamentDef }[] = [];

  // Fallback commissioner (first one)
  const fallbackCommId = commissionerMap.values().next().value!;

  // Map tournament countries to commissioner countries
  const countryToCommCountry: Record<string, string> = {
    'Russia': 'Spain',     // Carlos Garcia
    'Spain': 'Spain',
    'China': 'China',      // Chen Li
    'France': 'France',    // Pierre Dupont
    'Germany': 'Germany',  // Klaus Weber
    'India': 'India',      // Ravi Patel
    'Brazil': 'Brazil',    // Lucas Oliveira
    'USA': 'USA',          // James Wilson
    'Japan': 'Sweden',     // Erik Johansson
    'Sweden': 'Sweden',
    'UAE': 'Spain',
    'Italy': 'France',
  };

  for (const t of TOURNAMENTS) {
    const commCountry = countryToCommCountry[t.country] || 'Spain';
    const commId = commissionerMap.get(commCountry) || fallbackCommId;

    const startDate = t.daysOffset[0] > 0 ? daysAgo(t.daysOffset[0]) : daysFromNow(-t.daysOffset[0]);
    const endDate = t.daysOffset[1] > 0 ? daysAgo(t.daysOffset[1]) : daysFromNow(-t.daysOffset[1]);

    // Use title as unique identifier for upsert
    const existing = await prisma.tournament.findFirst({ where: { title: t.title } });

    let tournament;
    if (existing) {
      tournament = await prisma.tournament.update({
        where: { id: existing.id },
        data: {
          city: t.city,
          country: t.country,
          startDate,
          endDate,
          status: t.status,
          commissionerId: commId,
          maxParticipants: t.maxParticipants,
          fee: t.fee,
          currency: t.currency,
          description: t.description,
          ratingLimit: t.ratingLimit || null,
          timeControl: t.format,
        },
      });
    } else {
      tournament = await prisma.tournament.create({
        data: {
          title: t.title,
          city: t.city,
          country: t.country,
          startDate,
          endDate,
          status: t.status,
          commissionerId: commId,
          maxParticipants: t.maxParticipants,
          fee: t.fee,
          currency: t.currency,
          description: t.description,
          ratingLimit: t.ratingLimit || null,
          timeControl: t.format,
        },
      });
    }

    results.push({ id: tournament.id, def: t });
  }

  console.log(`  Created/updated ${TOURNAMENTS.length} tournaments`);
  return results;
}

async function seedRegistrationsAndPayments(
  tournaments: { id: string; def: TournamentDef }[],
  emailToId: Map<string, string>,
): Promise<Map<string, string[]>> {
  console.log('Seeding registrations and payments...');
  const tournamentParticipants = new Map<string, string[]>();
  let regCount = 0;
  let payCount = 0;

  const allUserIds = Array.from(emailToId.values());

  for (const t of tournaments) {
    // Skip PUBLISHED (upcoming) tournaments — no registrations yet
    if (t.def.status === TournamentStatus.PUBLISHED) {
      tournamentParticipants.set(t.id, []);
      continue;
    }

    // Determine how many participants
    let numParticipants: number;
    if (t.def.status === TournamentStatus.COMPLETED) {
      numParticipants = Math.min(Math.floor(t.def.maxParticipants * 0.8), allUserIds.length);
    } else if (t.def.status === TournamentStatus.IN_PROGRESS) {
      numParticipants = Math.min(Math.floor(t.def.maxParticipants * 0.7), allUserIds.length);
    } else {
      // REGISTRATION_OPEN
      numParticipants = Math.min(Math.floor(t.def.maxParticipants * 0.4), allUserIds.length);
    }

    const participants = shuffled(allUserIds).slice(0, numParticipants);
    tournamentParticipants.set(t.id, participants);

    for (const userId of participants) {
      const status: RegistrationStatus =
        t.def.status === TournamentStatus.COMPLETED || t.def.status === TournamentStatus.IN_PROGRESS
          ? RegistrationStatus.APPROVED
          : randomFrom([RegistrationStatus.PENDING, RegistrationStatus.APPROVED, RegistrationStatus.APPROVED]);

      // Create payment first for APPROVED registrations
      let paymentId: string | null = null;
      if (status === RegistrationStatus.APPROVED) {
        const existingPayment = await prisma.payment.findFirst({
          where: { userId, tournamentId: t.id },
        });

        if (existingPayment) {
          paymentId = existingPayment.id;
        } else {
          const payment = await prisma.payment.create({
            data: {
              userId,
              tournamentId: t.id,
              amount: t.def.fee,
              currency: t.def.currency,
              status: PaymentStatus.PAID,
              externalId: `pi_seed_${crypto.randomUUID().slice(0, 8)}`,
            },
          });
          paymentId = payment.id;
          payCount++;
        }
      }

      // Upsert registration
      await prisma.tournamentRegistration.upsert({
        where: {
          tournamentId_userId: { tournamentId: t.id, userId },
        },
        update: { status, paymentId },
        create: {
          tournamentId: t.id,
          userId,
          status,
          paymentId,
        },
      });
      regCount++;
    }
  }

  console.log(`  Created/updated ${regCount} registrations, ${payCount} payments`);
  return tournamentParticipants;
}

async function seedResults(
  tournaments: { id: string; def: TournamentDef }[],
  tournamentParticipants: Map<string, string[]>,
): Promise<void> {
  console.log('Seeding tournament results...');
  let count = 0;

  const completedTournaments = tournaments.filter(t => t.def.status === TournamentStatus.COMPLETED);

  for (const t of completedTournaments) {
    const participants = tournamentParticipants.get(t.id) || [];
    if (participants.length === 0) continue;

    // Get users with ratings for sorting
    const users = await prisma.user.findMany({
      where: { id: { in: participants } },
      select: { id: true, rating: true },
    });

    // Sort by rating + some randomness to simulate tournament results
    const sorted = users
      .map(u => ({ ...u, performanceScore: u.rating + normalRandom(0, 150) }))
      .sort((a, b) => b.performanceScore - a.performanceScore);

    const totalRounds = t.def.format.includes('BLITZ') ? 11 :
                        t.def.format.includes('RAPID') ? 7 : 9;

    for (let i = 0; i < sorted.length; i++) {
      const place = i + 1;
      // Score decreases with place, with some noise
      const maxScore = totalRounds;
      const expectedScore = maxScore * (1 - (place - 1) / sorted.length) * 0.85 + normalRandom(0, 0.5);
      const score = Math.max(0, Math.min(maxScore, Math.round(expectedScore * 2) / 2)); // round to 0.5

      // Elo change based on place
      let eloChange: number;
      if (place <= 3) {
        eloChange = clamp(normalRandom(15 - place * 3, 5), 5, 25);
      } else if (place <= sorted.length * 0.3) {
        eloChange = clamp(normalRandom(5, 3), 0, 12);
      } else if (place <= sorted.length * 0.6) {
        eloChange = clamp(normalRandom(0, 3), -5, 5);
      } else {
        eloChange = clamp(normalRandom(-8, 5), -20, 0);
      }

      await prisma.tournamentResult.upsert({
        where: {
          tournamentId_userId: { tournamentId: t.id, userId: sorted[i].id },
        },
        update: { place, score, eloChange },
        create: {
          tournamentId: t.id,
          userId: sorted[i].id,
          place,
          score,
          eloChange,
        },
      });
      count++;
    }
  }

  console.log(`  Created/updated ${count} tournament results`);
}

async function seedPhotos(
  tournaments: { id: string; def: TournamentDef }[],
  emailToId: Map<string, string>,
): Promise<void> {
  console.log('Seeding tournament photos (downloading from picsum + uploading to MinIO)...');
  let count = 0;

  const completedTournaments = tournaments.filter(t => t.def.status === TournamentStatus.COMPLETED);
  const uploaderIds = Array.from(emailToId.values());

  for (const t of completedTournaments) {
    const numPhotos = 3 + Math.floor(Math.random() * 6); // 3-8

    // Check existing photos
    const existingCount = await prisma.tournamentPhoto.count({ where: { tournamentId: t.id } });
    if (existingCount >= numPhotos) {
      console.log(`  Skipping photos for "${t.def.title}" — already has ${existingCount}`);
      continue;
    }

    const photosToCreate = numPhotos - existingCount;

    for (let i = 0; i < photosToCreate; i++) {
      try {
        // Download random image from picsum (800x600)
        const seed = `${t.id}-${i}-${Date.now()}`;
        const imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
        console.log(`  Downloading photo ${i + 1}/${photosToCreate} for "${t.def.title}"...`);
        const buffer = await downloadImage(imageUrl);

        // Upload to MinIO
        const key = `tournaments/photos/seed-${t.id.slice(-8)}-${i}-${crypto.randomUUID().slice(0, 8)}.jpg`;
        const url = await uploadToMinIO(buffer, key);

        const captions = [
          `Round ${i + 1} action at ${t.def.title}`,
          `Players competing in ${t.def.city}`,
          `Championship atmosphere at the ${t.def.title}`,
          `Top boards during round ${i + 2}`,
          `Prize ceremony at ${t.def.title}`,
          `Spectators watching the games`,
          `Analysis room after the round`,
          `Opening ceremony in ${t.def.city}`,
        ];

        await prisma.tournamentPhoto.create({
          data: {
            tournamentId: t.id,
            url,
            caption: captions[i % captions.length],
            uploadedBy: randomFrom(uploaderIds),
          },
        });
        count++;
      } catch (err) {
        console.error(`  Failed to create photo for ${t.def.title}: ${err}`);
      }
    }
  }

  console.log(`  Created ${count} tournament photos`);
}

async function seedNotifications(emailToId: Map<string, string>, tournaments: { id: string; def: TournamentDef }[]): Promise<void> {
  console.log('Seeding notifications...');
  let count = 0;

  const userIds = Array.from(emailToId.values());
  const tournamentTitles = tournaments.map(t => t.def.title);

  for (const userId of userIds) {
    // Check existing notifications
    const existingCount = await prisma.notification.count({ where: { userId } });
    if (existingCount >= 2) continue;

    const numNotifs = 2 + Math.floor(Math.random() * 4); // 2-5
    const toCreate = numNotifs - existingCount;

    for (let i = 0; i < toCreate; i++) {
      const tmpl = randomFrom(NOTIFICATION_TYPES);
      const tName = randomFrom(tournamentTitles);
      await prisma.notification.create({
        data: {
          userId,
          type: tmpl.type,
          title: tmpl.title,
          body: tmpl.body.replace('{tournament}', tName),
          isRead: Math.random() > 0.4,
          createdAt: daysAgo(Math.floor(Math.random() * 30)),
        },
      });
      count++;
    }
  }

  console.log(`  Created ${count} notifications`);
}

async function seedMemberships(emailToId: Map<string, string>): Promise<void> {
  console.log('Seeding memberships...');
  let count = 0;

  const userIds = Array.from(emailToId.values());
  // ~20% of users get memberships
  const memberUsers = shuffled(userIds).slice(0, Math.floor(userIds.length * 0.2));

  for (const userId of memberUsers) {
    const existing = await prisma.membership.findFirst({ where: { userId } });
    if (existing) continue;

    const startDate = daysAgo(Math.floor(Math.random() * 300));
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    const isExpired = endDate < new Date();

    await prisma.membership.create({
      data: {
        userId,
        startDate,
        endDate,
        status: isExpired ? MembershipStatus.EXPIRED : MembershipStatus.ACTIVE,
      },
    });
    count++;
  }

  console.log(`  Created ${count} memberships`);
}

async function seedOrganizationRequests(): Promise<void> {
  console.log('Seeding organization requests...');

  const requests = [
    { organizationName: 'London Chess Academy', contactName: 'Richard Stevens', email: 'r.stevens@londonchess.org', phone: '+44 20 7946 0958', description: 'Established chess academy seeking tournament hosting partnership.', status: RequestStatus.APPROVED },
    { organizationName: 'Nordic Chess Federation', contactName: 'Olaf Bergstrom', email: 'olaf@nordicchess.se', phone: '+46 8 123 4567', description: 'Regional federation looking to list Nordic circuit tournaments.', status: RequestStatus.PENDING },
    { organizationName: 'Cairo Chess Club', contactName: 'Ahmed Farouk', email: 'ahmed@cairochess.eg', description: 'Historic chess club in Cairo wanting to organize international events.', status: RequestStatus.PENDING },
    { organizationName: 'Sao Paulo Xadrez', contactName: 'Ana Ribeiro', email: 'ana@spxadrez.com.br', phone: '+55 11 9876 5432', description: 'Brazilian chess organization with 500+ active members.', status: RequestStatus.APPROVED },
    { organizationName: 'Shanghai Chess Association', contactName: 'Ming Zhao', email: 'ming@shanghaiches.cn', description: 'Official city chess association seeking international collaboration.', status: RequestStatus.REJECTED },
  ];

  let count = 0;
  for (const req of requests) {
    const existing = await prisma.organizationRequest.findFirst({ where: { email: req.email } });
    if (existing) continue;

    await prisma.organizationRequest.create({ data: req });
    count++;
  }

  console.log(`  Created ${count} organization requests`);
}

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log('=== Chess Tourism Seed Script ===\n');

  const emailToId = await seedUsers();
  const commissionerMap = await seedCommissioners(emailToId);
  const tournaments = await seedTournaments(commissionerMap);
  const tournamentParticipants = await seedRegistrationsAndPayments(tournaments, emailToId);
  await seedResults(tournaments, tournamentParticipants);
  await seedPhotos(tournaments, emailToId);
  await seedNotifications(emailToId, tournaments);
  await seedMemberships(emailToId);
  await seedOrganizationRequests();

  console.log('\n=== Seed complete! ===');

  // Print summary
  const userCount = await prisma.user.count();
  const commCount = await prisma.commissioner.count();
  const tournCount = await prisma.tournament.count();
  const regCount = await prisma.tournamentRegistration.count();
  const resultCount = await prisma.tournamentResult.count();
  const payCount = await prisma.payment.count();
  const photoCount = await prisma.tournamentPhoto.count();
  const notifCount = await prisma.notification.count();
  const memberCount = await prisma.membership.count();
  const orgReqCount = await prisma.organizationRequest.count();

  console.log(`
Summary:
  Users:           ${userCount}
  Commissioners:   ${commCount}
  Tournaments:     ${tournCount}
  Registrations:   ${regCount}
  Results:         ${resultCount}
  Payments:        ${payCount}
  Photos:          ${photoCount}
  Notifications:   ${notifCount}
  Memberships:     ${memberCount}
  Org Requests:    ${orgReqCount}
`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
