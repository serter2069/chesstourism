import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { uploadFile } from '../services/storage.service';
import {
  createTournament,
  updateTournament,
  changeStatus,
  listTournaments,
  getTournamentById,
  getParticipants,
  getResults,
  getPhotos,
  registerParticipant,
  cancelRegistration,
  submitResults,
  uploadPhoto,
  listAllTournaments,
  getHeroSettings,
  updateHeroSettings,
} from '../services/tournament.service';

const router = Router();

// multer: memory storage, 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// ─── PUBLIC ENDPOINTS ───────────────────────────────────

// GET /api/tournaments — list with filters
router.get('/tournaments', async (req: Request, res: Response) => {
  try {
    const result = await listTournaments({
      status: req.query.status as string,
      country: req.query.country as string,
      city: req.query.city as string,
      format: req.query.format as string,
      from: req.query.from as string,
      to: req.query.to as string,
      sort: req.query.sort as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.json(result);
  } catch (err) {
    console.error('List tournaments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tournaments/:id — single tournament details
router.get('/tournaments/:id', async (req: Request, res: Response) => {
  try {
    const tournament = await getTournamentById(req.params.id);
    res.json(tournament);
  } catch (err: any) {
    if (err.message === 'Tournament not found') {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error('Get tournament error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tournaments/:id/participants
router.get('/tournaments/:id/participants', async (req: Request, res: Response) => {
  try {
    const participants = await getParticipants(req.params.id);
    const data = participants.map((p) => ({
      id: p.id,
      user_id: p.user.id,
      name: p.user.name,
      surname: p.user.surname,
      country: p.user.country,
      registered_at: p.registered_at,
    }));
    res.json({ data });
  } catch (err: any) {
    if (err.message === 'Tournament not found') {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error('Get participants error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tournaments/:id/results
router.get('/tournaments/:id/results', async (req: Request, res: Response) => {
  try {
    const results = await getResults(req.params.id);
    const data = results.map((r) => ({
      place: r.place,
      name: r.user.name,
      surname: r.user.surname,
      score: r.score,
      elo_change: r.elo_change,
      elo_after: r.elo_after,
    }));
    res.json({ data });
  } catch (err: any) {
    if (err.message === 'Tournament not found') {
      res.status(404).json({ error: err.message });
      return;
    }
    if (err.message === 'Results are only available for completed tournaments') {
      res.status(400).json({ error: err.message });
      return;
    }
    console.error('Get results error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tournaments/:id/photos
router.get('/tournaments/:id/photos', async (req: Request, res: Response) => {
  try {
    const photos = await getPhotos(req.params.id);
    res.json({ data: photos });
  } catch (err: any) {
    if (err.message === 'Tournament not found') {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error('Get photos error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/settings/hero
router.get('/settings/hero', async (_req: Request, res: Response) => {
  try {
    const settings = await getHeroSettings();
    res.json(settings);
  } catch (err) {
    console.error('Get hero settings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── COMMISSAR ENDPOINTS ────────────────────────────────

// POST /api/tournaments — create tournament
router.post(
  '/tournaments',
  authenticate,
  requireRole('COMMISSAR'),
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        title, description, format, start_date, end_date,
        city, country, venue_address, max_participants,
        entry_fee, currency, rules, schedule,
      } = req.body;

      if (!title || !format || !start_date || !end_date || !city || !country) {
        res.status(400).json({
          error: 'title, format, start_date, end_date, city, and country are required',
        });
        return;
      }

      if (!['CLASSICAL', 'RAPID', 'BLITZ'].includes(format)) {
        res.status(400).json({ error: 'format must be CLASSICAL, RAPID, or BLITZ' });
        return;
      }

      if (new Date(end_date) <= new Date(start_date)) {
        res.status(400).json({ error: 'end_date must be after start_date' });
        return;
      }

      const tournament = await createTournament(req.user!.userId, {
        title, description, format, start_date, end_date, city, country,
        venue_address, max_participants, entry_fee, currency, rules, schedule,
      });

      res.status(201).json(tournament);
    } catch (err) {
      console.error('Create tournament error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// PUT /api/tournaments/:id — update tournament
router.put(
  '/tournaments/:id',
  authenticate,
  requireRole('COMMISSAR'),
  async (req: AuthRequest, res: Response) => {
    try {
      const tournament = await updateTournament(
        req.params.id,
        req.user!.userId,
        req.body,
      );
      res.json(tournament);
    } catch (err: any) {
      if (err.message === 'Tournament not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err.message === 'Not tournament owner') {
        res.status(403).json({ error: err.message });
        return;
      }
      if (err.message.includes('can only be edited')) {
        res.status(400).json({ error: err.message });
        return;
      }
      console.error('Update tournament error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// PATCH /api/tournaments/:id/status — change tournament status
router.patch(
  '/tournaments/:id/status',
  authenticate,
  requireRole('COMMISSAR'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;
      if (!status) {
        res.status(400).json({ error: 'status is required' });
        return;
      }

      const tournament = await changeStatus(
        req.params.id,
        req.user!.userId,
        status,
      );
      res.json(tournament);
    } catch (err: any) {
      if (err.message === 'Tournament not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err.message === 'Not tournament owner') {
        res.status(403).json({ error: err.message });
        return;
      }
      if (err.message.includes('Invalid status transition')) {
        res.status(400).json({ error: err.message });
        return;
      }
      console.error('Change status error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// POST /api/tournaments/:id/photos — upload photo
router.post(
  '/tournaments/:id/photos',
  authenticate,
  requireRole('COMMISSAR'),
  upload.single('photo'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Photo file is required' });
        return;
      }

      const url = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );
      const photo = await uploadPhoto(req.params.id, req.user!.userId, url);

      res.status(201).json(photo);
    } catch (err: any) {
      if (err.message === 'Tournament not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err.message === 'Not tournament owner') {
        res.status(403).json({ error: err.message });
        return;
      }
      console.error('Upload photo error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// POST /api/tournaments/:id/results — submit results
router.post(
  '/tournaments/:id/results',
  authenticate,
  requireRole('COMMISSAR'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { results } = req.body;

      if (!results || !Array.isArray(results) || results.length === 0) {
        res.status(400).json({
          error: 'results array is required and must not be empty',
        });
        return;
      }

      for (const r of results) {
        if (!r.userId || r.place === undefined || r.score === undefined) {
          res.status(400).json({
            error: 'Each result must have userId, place, and score',
          });
          return;
        }
      }

      const tournament = await submitResults(
        req.params.id,
        req.user!.userId,
        results,
      );
      res.json({ message: 'Results submitted, tournament completed', tournament });
    } catch (err: any) {
      if (err.message === 'Tournament not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err.message === 'Not tournament owner') {
        res.status(403).json({ error: err.message });
        return;
      }
      if (err.message.includes('can only be submitted')) {
        res.status(400).json({ error: err.message });
        return;
      }
      console.error('Submit results error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// ─── PARTICIPANT ENDPOINTS ──────────────────────────────

// POST /api/tournaments/:id/register
router.post(
  '/tournaments/:id/register',
  authenticate,
  requireRole('PARTICIPANT'),
  async (req: AuthRequest, res: Response) => {
    try {
      const participant = await registerParticipant(
        req.params.id,
        req.user!.userId,
      );
      res.status(201).json(participant);
    } catch (err: any) {
      if (err.message === 'Tournament not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      if (
        err.message === 'Tournament registration is not open' ||
        err.message === 'Tournament is full' ||
        err.message === 'Commissar cannot register as participant in own tournament'
      ) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (err.message === 'Already registered for this tournament') {
        res.status(409).json({ error: err.message });
        return;
      }
      console.error('Register for tournament error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// DELETE /api/tournaments/:id/register
router.delete(
  '/tournaments/:id/register',
  authenticate,
  requireRole('PARTICIPANT'),
  async (req: AuthRequest, res: Response) => {
    try {
      await cancelRegistration(req.params.id, req.user!.userId);
      res.json({ message: 'Registration cancelled' });
    } catch (err: any) {
      if (err.message === 'Tournament not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err.message === 'Can only cancel registration while registration is open') {
        res.status(400).json({ error: err.message });
        return;
      }
      if (err.message === 'Not registered for this tournament') {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error('Cancel registration error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// ─── ADMIN ENDPOINTS ────────────────────────────────────

// GET /api/admin/tournaments — all tournaments including drafts
router.get(
  '/admin/tournaments',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await listAllTournaments({
        status: req.query.status as string,
        country: req.query.country as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      });
      res.json(result);
    } catch (err) {
      console.error('Admin list tournaments error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// PATCH /api/admin/settings/hero — update hero settings
router.patch(
  '/admin/settings/hero',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, subtitle, image_url, button_text } = req.body;
      const settings = await updateHeroSettings({
        title, subtitle, image_url, button_text,
      });
      res.json(settings);
    } catch (err) {
      console.error('Update hero settings error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

export default router;
