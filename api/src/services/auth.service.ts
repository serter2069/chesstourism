import { PrismaClient, Role } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import {
  signAccessToken,
  signRefreshToken,
  signVerifyToken,
  signResetToken,
  verifyToken,
} from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service';

const prisma = new PrismaClient();

interface RegisterParticipantInput {
  email: string;
  password: string;
  name: string;
  surname: string;
  country?: string;
  city?: string;
}

interface RegisterCommissarInput extends RegisterParticipantInput {
  license_number: string;
  experience_years: number;
}

interface LoginInput {
  email: string;
  password: string;
}

function sanitizeUser(user: any) {
  const { password_hash, ...rest } = user;
  return rest;
}

export async function registerParticipant(input: RegisterParticipantInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  const password_hash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password_hash,
      role: Role.PARTICIPANT,
      name: input.name,
      surname: input.surname,
      country: input.country,
      city: input.city,
      rating: {
        create: { elo: 1200, peak_elo: 1200 },
      },
    },
    include: { rating: true },
  });

  const verifyToken_ = signVerifyToken(user.id);
  await sendVerificationEmail(user.email, verifyToken_).catch((err) => {
    console.error('Failed to send verification email:', err.message);
  });

  return { user: sanitizeUser(user) };
}

export async function registerCommissar(input: RegisterCommissarInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  const password_hash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password_hash,
      role: Role.COMMISSAR,
      name: input.name,
      surname: input.surname,
      country: input.country,
      city: input.city,
      rating: {
        create: { elo: 1200, peak_elo: 1200 },
      },
      commissar_profile: {
        create: {
          license_number: input.license_number,
          experience_years: input.experience_years,
          specializations: [],
          approved: false,
        },
      },
    },
    include: { rating: true, commissar_profile: true },
  });

  const verifyToken_ = signVerifyToken(user.id);
  await sendVerificationEmail(user.email, verifyToken_).catch((err) => {
    console.error('Failed to send verification email:', err.message);
  });

  return { user: sanitizeUser(user) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { rating: true, commissar_profile: true },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const valid = await comparePassword(input.password, user.password_hash);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);

  return {
    accessToken,
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

export async function verifyEmail(token: string) {
  const payload = verifyToken(token);

  if (payload.type !== 'verify') {
    throw new Error('Invalid token type');
  }

  await prisma.user.update({
    where: { id: payload.userId },
    data: { verified: true },
  });

  return { message: 'Email verified successfully' };
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user) {
    return { message: 'If an account exists with this email, a reset link has been sent' };
  }

  const phf = user.password_hash.slice(-10);
  const resetToken = signResetToken(user.id, phf);

  await sendPasswordResetEmail(user.email, resetToken).catch((err) => {
    console.error('Failed to send password reset email:', err.message);
  });

  return { message: 'If an account exists with this email, a reset link has been sent' };
}

export async function resetPassword(token: string, newPassword: string) {
  const payload = verifyToken(token);

  if (payload.type !== 'reset') {
    throw new Error('Invalid token type');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new Error('User not found');
  }

  // Check that password hasn't been changed since token was issued
  const currentPhf = user.password_hash.slice(-10);
  if (payload.phf !== currentPhf) {
    throw new Error('Reset token is no longer valid');
  }

  const password_hash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: payload.userId },
    data: { password_hash },
  });

  return { message: 'Password reset successfully' };
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
