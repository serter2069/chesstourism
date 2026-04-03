import { Role } from '@prisma/client';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendOtpEmail } from './email.service';
import { Response } from 'express';
import prisma from '../lib/prisma';
import Redis from 'ioredis';

const redis = new Redis({ host: '127.0.0.1', port: 6379 });
redis.on('error', (err) => console.error('[Redis] connection error:', err.message));

const OTP_ATTEMPT_TTL = 15 * 60; // 15 minutes in seconds

const DEV_MODE = process.env.NODE_ENV !== 'production';
const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 3;
const OTP_RATE_LIMIT_SECONDS = 30;
const SESSION_TTL_DAYS = 30;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateOtp(): string {
  if (DEV_MODE) return '000000';
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sanitizeUser(user: any) {
  // Explicitly pick only safe fields — never leak phone, sessions, etc.
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    surname: user.surname,
    city: user.city,
    country: user.country,
    rating: user.rating,
    fideId: user.fideId,
    fideTitle: user.fideTitle,
    fideRating: user.fideRating,
    onboardingCompleted: user.onboardingCompleted,
  };
}

// Set httpOnly cookies for tokens
export function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/api/auth/refresh',
  });
}

export function clearTokenCookies(res: Response) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
}

export async function requestOtp(email: string) {
  // Validate email
  if (!EMAIL_REGEX.test(email)) {
    throw Object.assign(new Error('Invalid email format'), { status: 400 });
  }

  // Rate limit: check last OTP sent for this email
  const recentOtp = await prisma.otpCode.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });

  if (recentOtp) {
    const secondsSinceLastOtp = (Date.now() - recentOtp.createdAt.getTime()) / 1000;
    if (secondsSinceLastOtp < OTP_RATE_LIMIT_SECONDS) {
      throw Object.assign(
        new Error(`Please wait ${Math.ceil(OTP_RATE_LIMIT_SECONDS - secondsSinceLastOtp)} seconds before requesting a new code`),
        { status: 429 },
      );
    }
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  // Create OTP record in dedicated table
  await prisma.otpCode.create({
    data: { email, code, expiresAt },
  });

  if (!DEV_MODE) {
    await sendOtpEmail(email, code).catch((err) => {
      console.error('Failed to send OTP email:', err.message);
    });
  }

  return { message: 'OTP sent' };
}

export async function verifyOtp(email: string, code: string) {
  // Find the latest unused, unexpired OTP for this email
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      email,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    throw Object.assign(new Error('No valid OTP found. Request a new code.'), { status: 401 });
  }

  // Check attempts via Redis (persistent across restarts and multi-instance)
  const attemptsKey = `otp_attempts:${email}`;
  let attempts = 0;
  try {
    attempts = parseInt((await redis.get(attemptsKey)) || '0');
  } catch (err) {
    // Redis unavailable — fail open to avoid blocking legitimate users
    console.error('[Redis] failed to read OTP attempts, failing open:', (err as Error).message);
  }

  if (attempts >= OTP_MAX_ATTEMPTS) {
    // Invalidate the OTP
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { usedAt: new Date() },
    });
    throw Object.assign(new Error('Too many attempts. Request a new code.'), { status: 429 });
  }

  // Check if code matches
  if (otpRecord.code !== code) {
    try {
      await redis.setex(attemptsKey, OTP_ATTEMPT_TTL, String(attempts + 1));
    } catch (err) {
      console.error('[Redis] failed to increment OTP attempts:', (err as Error).message);
    }
    const remaining = OTP_MAX_ATTEMPTS - attempts - 1;
    throw Object.assign(
      new Error(`Invalid code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`),
      { status: 401 },
    );
  }

  // Mark OTP as used and clear attempt counter
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { usedAt: new Date() },
  });
  try {
    await redis.del(attemptsKey);
  } catch (err) {
    console.error('[Redis] failed to clear OTP attempts:', (err as Error).message);
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email },
    include: { commissioner: true },
  });

  let isNewUser = false;
  if (!user) {
    user = await prisma.user.create({
      data: { email, role: Role.PARTICIPANT },
      include: { commissioner: true },
    });
    isNewUser = true;
  }

  // Generate token pair
  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);

  // Create session in DB
  const sessionExpiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt: sessionExpiresAt,
    },
  });

  return {
    token: accessToken,
    refreshToken,
    user: sanitizeUser(user),
    isNewUser,
    onboardingCompleted: user.onboardingCompleted,
  };
}

export async function refreshTokens(refreshToken: string) {
  // Verify the refresh token JWT
  const payload = verifyRefreshToken(refreshToken);

  if (payload.type !== 'refresh') {
    throw new Error('Invalid token type');
  }

  // Find the session in DB
  const session = await prisma.session.findUnique({
    where: { refreshToken },
  });

  if (!session) {
    throw new Error('Session not found — token may have been revoked');
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    throw new Error('Session expired');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new Error('User not found');
  }

  // Token rotation: generate new pair
  const newAccessToken = signAccessToken(user.id, user.role);
  const newRefreshToken = signRefreshToken(user.id, user.role);

  // Update session with new refresh token and sliding window expiry
  const newExpiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: newRefreshToken,
      expiresAt: newExpiresAt,
    },
  });

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(refreshToken: string) {
  if (refreshToken) {
    await prisma.session.deleteMany({ where: { refreshToken } }).catch(() => {
      // Session may not exist — that's fine
    });
  }
  return { ok: true };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { commissioner: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return sanitizeUser(user);
}
