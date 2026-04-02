import { Router, Request, Response } from 'express';
import {
  requestOtp,
  verifyOtp,
  refreshTokens,
  logout,
  getMe,
  setTokenCookies,
  clearTokenCookies,
} from '../services/auth.service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/send-code — aliases: /request-otp
router.post('/send-code', handleSendCode);
router.post('/request-otp', handleSendCode);

async function handleSendCode(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'email is required' });
      return;
    }

    const result = await requestOtp(email.trim().toLowerCase());
    res.json(result);
  } catch (err: any) {
    const status = err.status || 500;
    if (status === 500) console.error('Send code error:', err);
    res.status(status).json({ error: err.message || 'Internal server error' });
  }
}

// POST /api/auth/verify-code — aliases: /verify-otp
router.post('/verify-code', handleVerifyCode);
router.post('/verify-otp', handleVerifyCode);

async function handleVerifyCode(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ error: 'email and code are required' });
      return;
    }

    const result = await verifyOtp(email.trim().toLowerCase(), code.trim());

    // Set httpOnly cookies for web clients
    setTokenCookies(res, result.token, result.refreshToken);

    res.json(result);
  } catch (err: any) {
    const status = err.status || 500;
    if (status === 500) console.error('Verify code error:', err);
    res.status(status).json({ error: err.message || 'Internal server error' });
  }
}

// POST /api/auth/refresh — token rotation
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    // Accept refreshToken from body (native) or cookie (web)
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ error: 'refreshToken is required' });
      return;
    }

    const result = await refreshTokens(refreshToken);

    // Update cookies for web clients
    setTokenCookies(res, result.token, result.refreshToken);

    res.json(result);
  } catch (err: any) {
    console.error('Refresh error:', err);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// POST /api/auth/logout — delete session, clear cookies
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    await logout(refreshToken);
    clearTokenCookies(res);
    res.json({ ok: true });
  } catch (err: any) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me — current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getMe(req.user!.userId);
    res.json(user);
  } catch (err: any) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
