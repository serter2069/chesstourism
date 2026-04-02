import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

interface FideLookupResult {
  name: string | null;
  rating: number | null;
  country: string | null;
  title: string | null;
}

// POST /api/profile/fide-lookup — fetch FIDE profile by ID (no auth required for lookup)
router.post('/fide-lookup', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { fideId } = req.body;

    if (!fideId || typeof fideId !== 'string') {
      res.status(400).json({ error: 'fideId is required' });
      return;
    }

    // Validate: FIDE IDs are numeric strings
    if (!/^\d{3,12}$/.test(fideId.trim())) {
      res.status(400).json({ error: 'Invalid FIDE ID format (expected numeric, 3-12 digits)' });
      return;
    }

    const cleanId = fideId.trim();
    const result = await fetchFideProfile(cleanId);

    if (!result) {
      res.status(404).json({ error: 'FIDE ID not found' });
      return;
    }

    res.json(result);
  } catch (err) {
    console.error('FIDE lookup error:', err);
    res.status(500).json({ error: 'Failed to lookup FIDE profile' });
  }
});

// PUT /api/profile/fide — save FIDE data to user profile (authenticated)
router.put('/fide', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { fideId, fideRating, fideTitle } = req.body;

    if (!fideId || typeof fideId !== 'string') {
      res.status(400).json({ error: 'fideId is required' });
      return;
    }

    if (!/^\d{3,12}$/.test(fideId.trim())) {
      res.status(400).json({ error: 'Invalid FIDE ID format' });
      return;
    }

    const data: Record<string, string | number | null> = {
      fideId: fideId.trim(),
    };

    if (fideRating !== undefined) {
      data.fideRating = typeof fideRating === 'number' ? fideRating : null;
    }
    if (fideTitle !== undefined) {
      data.fideTitle = typeof fideTitle === 'string' && fideTitle.length > 0 ? fideTitle : null;
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        role: true,
        rating: true,
        fideId: true,
        fideRating: true,
        fideTitle: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (err) {
    console.error('Save FIDE data error:', err);
    res.status(500).json({ error: 'Failed to save FIDE data' });
  }
});

// Fetch FIDE profile from external sources
async function fetchFideProfile(fideId: string): Promise<FideLookupResult | null> {
  // Try FIDE ratings page scraping as primary source
  try {
    const response = await fetch(`https://ratings.fide.com/profile/${fideId}`, {
      headers: {
        'User-Agent': 'ChesTourism/1.0',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      const html = await response.text();

      // Extract name from profile page title
      const nameMatch = html.match(/<div class="profile-top-title">\s*([^<]+)/);
      const name = nameMatch ? nameMatch[1].trim() : null;

      // Extract standard rating
      const ratingMatch = html.match(/std\s*(?:<[^>]*>)*\s*(\d{3,4})/i)
        || html.match(/rating.*?(\d{4})/i);
      const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : null;

      // Extract country
      const countryMatch = html.match(/Federation<\/div>\s*<div[^>]*>([^<]+)/i)
        || html.match(/flag\/(\w+)/i);
      const country = countryMatch ? countryMatch[1].trim() : null;

      // Extract title (GM, IM, FM, CM, WGM, WIM, WFM, WCM)
      const titleMatch = html.match(/(?:title|FIDE title)[^<]*<[^>]*>\s*((?:W)?[GIFC]M)\b/i)
        || html.match(/<span[^>]*>\s*(GM|IM|FM|CM|WGM|WIM|WFM|WCM)\s*<\/span>/i);
      const title = titleMatch ? titleMatch[1].toUpperCase() : null;

      if (name) {
        return { name, rating, country, title };
      }
    }
  } catch (err) {
    console.warn('FIDE profile fetch failed, trying fallback:', (err as Error).message);
  }

  // Development fallback: return mock data when DEV_AUTH is set
  if (process.env.DEV_AUTH === 'true') {
    return {
      name: `Player ${fideId}`,
      rating: 1800 + Math.floor(Math.random() * 600),
      country: 'RUS',
      title: ['GM', 'IM', 'FM', 'CM', null][Math.floor(Math.random() * 5)],
    };
  }

  return null;
}

export default router;
