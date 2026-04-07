import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * Generate a deterministic HMAC-SHA256 token for email unsubscribe links.
 * No expiry — the token remains valid as long as JWT_SECRET is unchanged.
 */
export function signUnsubscribeToken(email: string): string {
  return crypto.createHmac('sha256', SECRET).update(email.toLowerCase()).digest('hex');
}

/**
 * Verify an unsubscribe token and return the email it was issued for.
 * Returns null if the token is invalid.
 */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = signUnsubscribeToken(email.toLowerCase());
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
}
