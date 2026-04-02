import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';

// Validate secrets at startup in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-jwt-secret') {
    throw new Error('JWT_SECRET is not configured');
  }
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'your-jwt-refresh-secret') {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }
  if (process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different');
  }
}

interface TokenPayload {
  userId: string;
  role: string;
  type: 'access' | 'refresh';
}

export function signAccessToken(userId: string, role: string): string {
  return jwt.sign({ userId, role, type: 'access' }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function signRefreshToken(userId: string, role: string): string {
  return jwt.sign({ userId, role, type: 'refresh' }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}

// Keep backward-compatible export for middleware
export function verifyToken(token: string): TokenPayload {
  return verifyAccessToken(token);
}
