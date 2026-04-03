import { Router } from 'express';

const router = Router();

// GET /api/settings/hero — returns hero banner content for the homepage
router.get('/hero', (req, res) => {
  res.json({
    title: 'International Chess Tourism Association',
    subtitle: 'Discover chess tournaments and travel experiences around the world',
  });
});

export default router;
