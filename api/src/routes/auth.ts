import { Router, Request, Response } from 'express';
import {
  registerParticipant,
  registerCommissar,
  login,
  refreshTokens,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} from '../services/auth.service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/register/participant', async (req: Request, res: Response) => {
  try {
    const { email, password, name, surname, country, city } = req.body;

    if (!email || !password || !name || !surname) {
      res.status(400).json({ error: 'email, password, name, and surname are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    const result = await registerParticipant({ email, password, name, surname, country, city });
    res.status(201).json(result);
  } catch (err: any) {
    if (err.message === 'Email already registered') {
      res.status(409).json({ error: err.message });
      return;
    }
    console.error('Register participant error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register/commissar', async (req: Request, res: Response) => {
  try {
    const { email, password, name, surname, country, city, license_number, experience_years } = req.body;

    if (!email || !password || !name || !surname || !license_number || experience_years === undefined) {
      res.status(400).json({ error: 'email, password, name, surname, license_number, and experience_years are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    const result = await registerCommissar({
      email, password, name, surname, country, city,
      license_number,
      experience_years: parseInt(experience_years, 10),
    });
    res.status(201).json(result);
  } catch (err: any) {
    if (err.message === 'Email already registered') {
      res.status(409).json({ error: err.message });
      return;
    }
    console.error('Register commissar error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    const result = await login({ email, password });
    res.json(result);
  } catch (err: any) {
    if (err.message === 'Invalid email or password') {
      res.status(401).json({ error: err.message });
      return;
    }
    console.error('Login error:', err);
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

router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: 'token is required' });
      return;
    }

    const result = await verifyEmail(token);
    res.json(result);
  } catch (err: any) {
    console.error('Verify email error:', err);
    res.status(400).json({ error: 'Invalid or expired verification token' });
  }
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'email is required' });
      return;
    }

    const result = await forgotPassword(email);
    res.json(result);
  } catch (err: any) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ error: 'token and newPassword are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    const result = await resetPassword(token, newPassword);
    res.json(result);
  } catch (err: any) {
    console.error('Reset password error:', err);
    res.status(400).json({ error: 'Invalid or expired reset token' });
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
