import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
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
import membershipRouter from './routes/membership';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3811;

const allowedOrigins = [
  'https://chesstourism.smartlaunchhub.com',
  'http://localhost:8081',
  'http://localhost:3000',
  'http://localhost:19006',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: origin not allowed'));
    }
  },
  credentials: true, // needed for httpOnly cookies (auth)
}));

// Stripe webhook needs raw body — mount BEFORE express.json()
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  next();
});

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'chesstourism', version: process.env.npm_package_version });
});

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
app.use('/api/membership', membershipRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`ChesTourism API running on port ${PORT}`);
});
