import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

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

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    res.status(401).json({ error: 'Authorization token required' });
    return;
  }

  try {
    const payload = verifyToken(token);

    if (payload.type !== 'access') {
      res.status(401).json({ error: 'Invalid token type' });
      return;
    }

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
