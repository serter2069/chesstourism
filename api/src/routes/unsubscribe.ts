import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { verifyUnsubscribeToken } from '../utils/unsubscribeToken';

const router = Router();

// GET /api/unsubscribe?email=...&token=...
// No authentication required — accessed directly from email links.
router.get('/unsubscribe', async (req: Request, res: Response) => {
  const { email, token } = req.query;

  if (typeof email !== 'string' || typeof token !== 'string' || !email || !token) {
    res.status(400).send(unsubscribeHtml('Invalid Request', 'The unsubscribe link is missing required parameters.', false));
    return;
  }

  // Validate token length to avoid timing attack surface from malformed input
  if (token.length !== 64) {
    res.status(400).send(unsubscribeHtml('Invalid Link', 'This unsubscribe link is invalid or has expired.', false));
    return;
  }

  let tokenValid = false;
  try {
    tokenValid = verifyUnsubscribeToken(email, token);
  } catch {
    // Buffer.from may throw on invalid hex
    tokenValid = false;
  }

  if (!tokenValid) {
    res.status(400).send(unsubscribeHtml('Invalid Link', 'This unsubscribe link is invalid or has expired.', false));
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, emailOptOut: true },
  });

  if (!user) {
    // Return success-like page to avoid email enumeration
    res.send(unsubscribeHtml('Unsubscribed', 'You have been unsubscribed from marketing emails.', true));
    return;
  }

  if (user.emailOptOut) {
    res.send(unsubscribeHtml('Already Unsubscribed', 'You are already unsubscribed from marketing emails.', true));
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailOptOut: true },
  });

  res.send(unsubscribeHtml('Unsubscribed', 'You have been successfully unsubscribed from marketing emails. You will still receive transactional emails such as login codes and payment confirmations.', true));
});

function unsubscribeHtml(title: string, message: string, success: boolean): string {
  const color = success ? '#2d6a2d' : '#8b1a1a';
  const bgColor = success ? '#f0faf0' : '#fdf0f0';
  const borderColor = success ? '#b2d8b2' : '#f0b2b2';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — ChesTourism</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); padding: 48px 40px; max-width: 480px; width: 100%; text-align: center; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 12px; }
    .message { background: ${bgColor}; border: 1px solid ${borderColor}; color: ${color}; border-radius: 8px; padding: 16px 20px; font-size: 15px; line-height: 1.5; margin-bottom: 24px; }
    .brand { color: #888; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? '✓' : '✗'}</div>
    <h1>${title}</h1>
    <div class="message">${message}</div>
    <p class="brand">ChesTourism — International Chess Tourism Association</p>
  </div>
</body>
</html>`;
}

export default router;
