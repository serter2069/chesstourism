import { Request, Response, NextFunction } from 'express';
import { verifyToken, verifyDownloadToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  // Try Bearer token first, then httpOnly cookie
  const authHeader = req.headers.authorization;
  let token: string | undefined;
  let isQueryToken = false;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (typeof req.query?.token === 'string' && req.query.token) {
    // Only allow short-lived download-scoped tokens via query param, never full access tokens
    token = req.query.token as string;
    isQueryToken = true;
  }

  if (!token) {
    res.status(401).json({ error: 'Authorization token required' });
    return;
  }

  try {
    if (isQueryToken) {
      // Query-param tokens must be download-scoped (5min lifetime, scope:'download')
      const payload = verifyDownloadToken(token);
      req.user = {
        userId: payload.userId,
        role: 'USER',
      };
    } else {
      const payload = verifyToken(token);

      if (payload.type !== 'access') {
        res.status(401).json({ error: 'Invalid token type' });
        return;
      }

      req.user = {
        userId: payload.userId,
        role: payload.role,
      };
    }

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
