import { PrismaClient, Role } from '@prisma/client';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt';
import { sendOtpEmail } from './email.service';

const prisma = new PrismaClient();

const DEV_MODE = process.env.NODE_ENV !== 'production';
const OTP_TTL_MINUTES = 10;

function generateOtp(): string {
  if (DEV_MODE) return '000000';
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sanitizeUser(user: any) {
  const { password_hash, otp_code, otp_expires_at, ...rest } = user;
  return rest;
}

export async function requestOtp(email: string) {
  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } });

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        role: Role.PARTICIPANT,
        otp_code: code,
        otp_expires_at: expiresAt,
      },
    });
  } else {
    user = await prisma.user.update({
      where: { email },
      data: {
        otp_code: code,
        otp_expires_at: expiresAt,
      },
    });
  }

  if (!DEV_MODE) {
    await sendOtpEmail(email, code).catch((err) => {
      console.error('Failed to send OTP email:', err.message);
    });
  }

  return { message: 'OTP sent' };
}

export async function verifyOtp(email: string, code: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { rating: true, commissar_profile: true },
  });

  if (!user) {
    throw new Error('Invalid email or OTP');
  }

  if (!user.otp_code || !user.otp_expires_at) {
    throw new Error('No OTP requested for this email');
  }

  if (user.otp_code !== code) {
    throw new Error('Invalid email or OTP');
  }

  if (user.otp_expires_at < new Date()) {
    throw new Error('OTP expired');
  }

  // Clear OTP after successful verification
  await prisma.user.update({
    where: { email },
    data: { otp_code: null, otp_expires_at: null },
  });

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);

  return {
    token: accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
}

export async function refreshTokens(refreshToken: string) {
  const payload = verifyToken(refreshToken);

  if (payload.type !== 'refresh') {
    throw new Error('Invalid token type');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new Error('User not found');
  }

  const newAccessToken = signAccessToken(user.id, user.role);
  const newRefreshToken = signRefreshToken(user.id, user.role);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { rating: true, commissar_profile: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return sanitizeUser(user);
}
