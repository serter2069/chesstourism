import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Public endpoint — no authenticate middleware
router.get('/verify/:certificateId', async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;

    const registration = await prisma.tournamentRegistration.findUnique({
      where: { id: certificateId },
      include: {
        user: { select: { name: true, surname: true } },
        tournament: {
          select: { title: true, startDate: true, status: true },
        },
      },
    });

    if (!registration) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Re-query result separately since we need registration.userId
    const result = await prisma.tournamentResult.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId: registration.tournamentId,
          userId: registration.userId,
        },
      },
      select: { place: true },
    });

    const isRevoked =
      registration.tournament.status === 'CANCELLED' ||
      registration.status === 'REJECTED';

    const participantName = [registration.user.name, registration.user.surname]
      .filter(Boolean)
      .join(' ') || 'Participant';

    return res.json({
      participantName,
      tournamentName: registration.tournament.title,
      place: result?.place ?? null,
      date: registration.tournament.startDate,
      status: isRevoked ? 'revoked' : 'valid',
    });
  } catch (err) {
    console.error('Verify certificate error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
