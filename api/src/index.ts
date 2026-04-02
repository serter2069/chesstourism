import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import commissarsRouter from './routes/commissars';
import ratingsRouter from './routes/ratings';
import tournamentRouter from './routes/tournaments';
import paymentsRouter from './routes/payments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3811;

app.use(cors());

// Stripe webhook needs raw body — mount BEFORE express.json()
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  next();
});

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'chesstourism', version: process.env.npm_package_version });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/commissars', commissarsRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api', tournamentRouter);
app.use('/api', paymentsRouter);

app.listen(PORT, () => {
  console.log(`ChesTourism API running on port ${PORT}`);
});
