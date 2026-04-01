import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3811;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'chesstourism', version: process.env.npm_package_version });
});

app.listen(PORT, () => {
  console.log(`ChesTourism API running on port ${PORT}`);
});
