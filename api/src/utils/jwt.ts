import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

interface TokenPayload {
  userId: string;
  role: string;
  type: 'access' | 'refresh' | 'verify' | 'reset';
}

export function signAccessToken(userId: string, role: string): string {
  return jwt.sign({ userId, role, type: 'access' }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function signRefreshToken(userId: string, role: string): string {
  return jwt.sign({ userId, role, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function signVerifyToken(userId: string): string {
  return jwt.sign({ userId, type: 'verify' }, JWT_SECRET, {
    expiresIn: '24h',
  });
}

export function signResetToken(userId: string, passwordHashFragment: string): string {
  return jwt.sign({ userId, type: 'reset', phf: passwordHashFragment }, JWT_SECRET, {
    expiresIn: '1h',
  });
}

export function verifyToken(token: string): TokenPayload & { phf?: string } {
  return jwt.verify(token, JWT_SECRET) as TokenPayload & { phf?: string };
}
