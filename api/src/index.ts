import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import commissarsRouter from './routes/commissars';
import ratingsRouter from './routes/ratings';
import tournamentRouter from './routes/tournaments';
import paymentsRouter from './routes/payments';
import profileRouter from './routes/profile';
import fideRouter from './routes/fide';
import watchlistRouter from './routes/watchlist';
import organizationsRouter from './routes/organizations';
import adminRouter from './routes/admin';
import notificationsRouter from './routes/notifications';
import settingsRouter from './routes/settings';
import verifyRouter from './routes/verify';
import unsubscribeRouter from './routes/unsubscribe';
import './lib/scheduleQueue'; // initialize BullMQ Worker for schedule-change email debounce
import './lib/paymentRecoveryJob'; // BullMQ repeatable job: recover missed Stripe webhook payments
import { emailQueue } from './lib/emailQueue'; // initialize BullMQ Worker for async email delivery with retry
import { pushQueue } from './lib/pushQueue'; // initialize BullMQ Worker for FCM push delivery with retry

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use(helmet());
const PORT = process.env.PORT || 3811;

const allowedOrigins = [
  'https://chesstourism.smartlaunchhub.com',
  'http://localhost:8081',
  'http://localhost:3000',
  'http://localhost:8203',
  'http://localhost:19006',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: origin not allowed'));
    }
  },
  credentials: true, // needed for httpOnly cookies (auth)
};

app.use(cors(corsOptions));
// Handle OPTIONS preflight for all routes (must be before route handlers)
app.options('*', cors(corsOptions));

// Stripe webhook needs raw body — mount BEFORE express.json()
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  next();
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for public endpoints to prevent scraping/abuse.
// 60 req/15min < generalLimiter (100), so this fires first for these routes.
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/tournaments', publicLimiter);
app.use('/api/ratings', publicLimiter);
app.use('/api/commissars', publicLimiter);
app.use('/api/users', publicLimiter);
app.use('/api/organization-requests', publicLimiter);

app.use(express.json());
app.use(cookieParser());

// ─── Bull Board (queue monitor) — scoped to /admin/queues ────────────────────

const bullBoardAdapter = new ExpressAdapter();
bullBoardAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(emailQueue), new BullMQAdapter(pushQueue)],
  serverAdapter: bullBoardAdapter,
});

// Basic-auth guard — scoped ONLY to /admin/queues, does not affect any other route
function bullBoardAuth(req: Request, res: Response, next: NextFunction): void {
  const password = process.env.BULL_BOARD_PASSWORD;
  if (!password) {
    // If no password configured, block access entirely
    res.status(503).json({ error: 'Bull Board not configured' });
    return;
  }

  const authHeader = req.headers.authorization ?? '';
  const encoded = Buffer.from(`admin:${password}`).toString('base64');
  if (authHeader !== `Basic ${encoded}`) {
    res.set('WWW-Authenticate', 'Basic realm="Bull Board"');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}

app.use('/admin/queues', bullBoardAuth, bullBoardAdapter.getRouter());

// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'chesstourism', version: process.env.npm_package_version });
});

app.use('/api', verifyRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/commissars', commissarsRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api', tournamentRouter);
app.use('/api', paymentsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/profile', fideRouter);
app.use('/api', watchlistRouter);
app.use('/api', organizationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api', notificationsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api', unsubscribeRouter);

app.listen(PORT, () => {
  console.log(`ChesTourism API running on port ${PORT}`);
});
