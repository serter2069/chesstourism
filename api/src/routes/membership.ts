import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { generateMembershipCertificate } from '../services/pdf.service';
import { uploadFile } from '../services/storage.service';

const APP_BASE_URL = process.env.APP_BASE_URL || 'https://chesstourism.smartlaunchhub.com';

function buildMemberNumber(membershipId: string): string {
  const year = new Date().getFullYear();
  const seq = membershipId.slice(-5).toUpperCase();
  return `IACT-${year}-${seq}`;
}
const router = Router();

// POST /api/membership/activate — create or return existing active membership
router.post('/activate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Check if already has active membership
    const existing = await prisma.membership.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
    });

    if (existing) {
      res.json({
        membership: existing,
        message: 'Membership already active',
      });
      return;
    }

    // Create 1-year membership
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const membership = await prisma.membership.create({
      data: {
        userId,
        startDate,
        endDate,
        status: 'ACTIVE',
      },
    });

    // Generate PDF certificate and upload to MinIO
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const memberName = user?.name || user?.email || 'Member';
      const memberEmail = user?.email || '';
      const memberNumber = buildMemberNumber(membership.id);
      const profileUrl = `${APP_BASE_URL}/profile/${userId}`;

      const pdfBuffer = await generateMembershipCertificate(
        memberName,
        memberEmail,
        memberNumber,
        startDate,
        endDate,
        profileUrl,
      );
      const certificateUrl = await uploadFile(
        pdfBuffer,
        `membership-certificate-${membership.id}.pdf`,
        'application/pdf',
      );
      await prisma.membership.update({
        where: { id: membership.id },
        data: { certificateUrl },
      });
      const membershipWithCert = { ...membership, certificateUrl };
      res.status(201).json({ membership: membershipWithCert });
    } catch (certErr) {
      console.error('Certificate generation failed (non-fatal):', certErr);
      res.status(201).json({ membership });
    }
  } catch (err: any) {
    console.error('Membership activate error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/membership/my — get current user's membership status
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const membership = await prisma.membership.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!membership) {
      res.json({ membership: null });
      return;
    }

    // Mark as expired if past endDate
    if (membership.status === 'ACTIVE' && membership.endDate < new Date()) {
      const updated = await prisma.membership.update({
        where: { id: membership.id },
        data: { status: 'EXPIRED' },
      });
      res.json({ membership: updated });
      return;
    }

    res.json({ membership });
  } catch (err: any) {
    console.error('Membership my error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/membership/certificate — redirect to PDF certificate (generate + upload if missing)
router.get('/certificate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const membership = await prisma.membership.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });

    if (!membership) {
      res.status(404).json({ error: 'No active membership found' });
      return;
    }

    // If certificateUrl already stored, redirect to it
    if (membership.certificateUrl) {
      res.redirect(302, membership.certificateUrl);
      return;
    }

    // Otherwise generate PDF now, upload, persist, then redirect
    const memberName = user.name || user.email;
    const memberEmail = user.email;
    const memberNumber = buildMemberNumber(membership.id);
    const profileUrl = `${APP_BASE_URL}/profile/${userId}`;

    const pdfBuffer = await generateMembershipCertificate(
      memberName,
      memberEmail,
      memberNumber,
      membership.startDate,
      membership.endDate,
      profileUrl,
    );
    const certificateUrl = await uploadFile(
      pdfBuffer,
      `membership-certificate-${membership.id}.pdf`,
      'application/pdf',
    );
    await prisma.membership.update({
      where: { id: membership.id },
      data: { certificateUrl },
    });

    res.redirect(302, certificateUrl);
  } catch (err: any) {
    console.error('Certificate error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
