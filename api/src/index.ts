import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
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
import './lib/scheduleQueue'; // initialize BullMQ Worker for schedule-change email debounce

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use(helmet());
const PORT = process.env.PORT || 3811;

const allowedOrigins = [
  'https://chesstourism.smartlaunchhub.com',
  'http://localhost:8081',
  'http://localhost:3000',
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

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

app.use(express.json());
app.use(cookieParser());

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

app.listen(PORT, () => {
  console.log(`ChesTourism API running on port ${PORT}`);
});
