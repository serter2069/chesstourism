import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
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

    res.status(201).json({ membership });
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

// GET /api/membership/certificate — generate HTML certificate
router.get('/certificate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

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

    const memberName = user.name || user.email;
    const memberNumber = membership.id.slice(-8).toUpperCase();

    function formatDate(d: Date): string {
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Membership Certificate — Chess Tourism Federation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #F5F1E8;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Georgia, 'Times New Roman', serif;
      padding: 24px;
    }
    .cert-wrapper {
      max-width: 780px;
      width: 100%;
    }
    .cert {
      background: #FFFFFF;
      border: 4px solid #0D1B3E;
      border-radius: 4px;
      padding: 0;
      position: relative;
      box-shadow: 0 8px 40px rgba(13,27,62,0.18);
    }
    .cert-inner {
      border: 2px solid #C59A1A;
      margin: 10px;
      padding: 52px 60px;
      text-align: center;
    }
    .chess-bar {
      background: #0D1B3E;
      height: 10px;
      display: flex;
      overflow: hidden;
    }
    .chess-bar span {
      display: inline-block;
      width: 10px;
      height: 10px;
      flex-shrink: 0;
    }
    .chess-bar span:nth-child(odd) { background: #0D1B3E; }
    .chess-bar span:nth-child(even) { background: #C59A1A; }
    .header-org {
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #5C6B8A;
      margin-bottom: 8px;
    }
    .header-title {
      font-size: 36px;
      font-weight: bold;
      color: #0D1B3E;
      letter-spacing: 2px;
      margin-bottom: 6px;
    }
    .header-subtitle {
      font-size: 14px;
      color: #C59A1A;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-bottom: 32px;
    }
    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 32px;
    }
    .divider-line {
      flex: 1;
      max-width: 100px;
      height: 1px;
      background: linear-gradient(to right, transparent, #C59A1A);
    }
    .divider-line.right {
      background: linear-gradient(to left, transparent, #C59A1A);
    }
    .divider-star {
      color: #C59A1A;
      font-size: 18px;
    }
    .certifies {
      font-size: 15px;
      color: #5C6B8A;
      font-style: italic;
      margin-bottom: 16px;
    }
    .member-name {
      font-size: 38px;
      font-weight: bold;
      color: #0D1B3E;
      margin-bottom: 8px;
      line-height: 1.1;
    }
    .member-email {
      font-size: 13px;
      color: #5C6B8A;
      margin-bottom: 32px;
    }
    .cert-body {
      font-size: 15px;
      color: #3a4a6b;
      line-height: 1.6;
      max-width: 520px;
      margin: 0 auto 32px;
    }
    .membership-card {
      display: inline-block;
      background: #0D1B3E;
      color: #FFFFFF;
      border-radius: 8px;
      padding: 20px 40px;
      margin-bottom: 36px;
    }
    .membership-card-row {
      display: flex;
      gap: 48px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .membership-card-item {
      text-align: center;
    }
    .membership-card-label {
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #C59A1A;
      margin-bottom: 4px;
      font-family: Arial, sans-serif;
    }
    .membership-card-value {
      font-size: 15px;
      font-weight: bold;
      color: #FFFFFF;
      font-family: Arial, sans-serif;
    }
    .status-badge {
      display: inline-block;
      background: #27AE60;
      color: #FFFFFF;
      font-family: Arial, sans-serif;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 4px 14px;
      border-radius: 20px;
      margin-top: 12px;
    }
    .footer-divider {
      border: none;
      border-top: 1px solid #DDE3ED;
      margin: 32px 0 24px;
    }
    .footer-chess {
      font-size: 22px;
      color: #C59A1A;
      letter-spacing: 8px;
      margin-bottom: 16px;
    }
    .footer-text {
      font-size: 11px;
      color: #5C6B8A;
      font-family: Arial, sans-serif;
      letter-spacing: 1px;
    }
    .download-hint {
      margin-top: 20px;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #5C6B8A;
    }
    @media print {
      body { background: white; padding: 0; }
      .download-hint { display: none; }
      .cert { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="cert-wrapper">
    <div class="cert">
      <div class="chess-bar">
        ${Array.from({ length: 80 }, (_, i) => `<span></span>`).join('')}
      </div>
      <div class="cert-inner">
        <div class="header-org">International Chess Tourism Federation</div>
        <div class="header-title">Certificate</div>
        <div class="header-subtitle">of Membership</div>

        <div class="divider">
          <div class="divider-line"></div>
          <div class="divider-star">&#9812;</div>
          <div class="divider-line right"></div>
        </div>

        <div class="certifies">This is to certify that</div>
        <div class="member-name">${escapeHtml(memberName)}</div>
        <div class="member-email">${escapeHtml(user.email)}</div>

        <div class="cert-body">
          is a registered member of the International Chess Tourism Federation
          and is entitled to all rights and privileges of full membership.
        </div>

        <div class="membership-card">
          <div class="membership-card-row">
            <div class="membership-card-item">
              <div class="membership-card-label">Member No.</div>
              <div class="membership-card-value">#${memberNumber}</div>
            </div>
            <div class="membership-card-item">
              <div class="membership-card-label">Valid From</div>
              <div class="membership-card-value">${formatDate(membership.startDate)}</div>
            </div>
            <div class="membership-card-item">
              <div class="membership-card-label">Valid Until</div>
              <div class="membership-card-value">${formatDate(membership.endDate)}</div>
            </div>
          </div>
          <div class="status-badge">Active Member</div>
        </div>

        <hr class="footer-divider">
        <div class="footer-chess">&#9812; &#9813; &#9814; &#9815; &#9816; &#9817;</div>
        <div class="footer-text">International Chess Tourism Federation &bull; chesstourism.smartlaunchhub.com</div>
      </div>
      <div class="chess-bar">
        ${Array.from({ length: 80 }, (_, i) => `<span></span>`).join('')}
      </div>
    </div>
    <div class="download-hint">Press Ctrl+P (or Cmd+P) to print / save as PDF</div>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="membership-certificate-${memberNumber}.html"`);
    res.send(html);
  } catch (err: any) {
    console.error('Certificate error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default router;
