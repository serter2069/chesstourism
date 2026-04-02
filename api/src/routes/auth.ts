import { Router, Request, Response } from 'express';
import { requestOtp, verifyOtp, refreshTokens, getMe } from '../services/auth.service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/request-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'email is required' });
      return;
    }

    const result = await requestOtp(email.trim().toLowerCase());
    res.json(result);
  } catch (err: any) {
    console.error('Request OTP error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ error: 'email and code are required' });
      return;
    }

    const result = await verifyOtp(email.trim().toLowerCase(), code.trim());
    res.json(result);
  } catch (err: any) {
    if (
      err.message === 'Invalid email or OTP' ||
      err.message === 'No OTP requested for this email' ||
      err.message === 'OTP expired'
    ) {
      res.status(401).json({ error: err.message });
      return;
    }
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'refreshToken is required' });
      return;
    }

    const result = await refreshTokens(refreshToken);
    res.json(result);
  } catch (err: any) {
    console.error('Refresh error:', err);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

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
