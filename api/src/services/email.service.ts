import prisma from '../lib/prisma';
import { signUnsubscribeToken } from '../utils/unsubscribeToken';

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const FROM_EMAIL = 'noreply@diagrams.love';
const FROM_NAME = 'ChesTourism';
const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

interface BrevoAttachment {
  name: string;
  content: string; // base64
}

interface BrevoPayload {
  sender: { name: string; email: string };
  to: Array<{ email: string }>;
  subject: string;
  htmlContent: string;
  attachment?: BrevoAttachment[];
}

async function brevoSend(payload: BrevoPayload): Promise<void> {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo API error ${response.status}: ${body}`);
  }
}

/**
 * Check whether the user with the given email has opted out of marketing emails.
 * Returns true if opted out (email should NOT be sent).
 */
async function isEmailOptedOut(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailOptOut: true },
  });
  return user?.emailOptOut === true;
}

/**
 * Build the unsubscribe footer HTML to append to marketing emails.
 */
function buildUnsubscribeFooter(email: string): string {
  const token = signUnsubscribeToken(email);
  const unsubscribeUrl = `${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
  return `
    <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e5e5;" />
    <p style="color: #888; font-size: 12px; text-align: center;">
      You are receiving this email because you are registered on ChesTourism.<br/>
      <a href="${unsubscribeUrl}" style="color: #888;">Unsubscribe from marketing emails</a>
    </p>
  `;
}

// ─── Transactional emails (no opt-out check) ──────────────────────────────────

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email }],
    subject: 'Your ChesTourism login code',
    htmlContent: `
      <h2>Your Login Code</h2>
      <p>Use the code below to sign in to ChesTourism:</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center;">${code}</p>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}

export async function sendCommissarApproval(
  to: string,
  userName: string,
  approved: boolean,
  comment?: string,
): Promise<void> {
  const status = approved ? 'Approved' : 'Declined';
  const subject = approved
    ? 'Your commissar application has been approved!'
    : 'Update on your commissar application';

  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject,
    htmlContent: `
      <h2>Commissar Application ${status}</h2>
      <p>Dear ${userName},</p>
      <p>Your commissar application has been <strong>${status.toLowerCase()}</strong>.</p>
      ${comment ? `<p>Comment: ${comment}</p>` : ''}
      ${approved
        ? '<p>You can now create and manage tournaments on ChesTourism.</p>'
        : '<p>Please review the requirements and feel free to reapply.</p>'
      }
      <p>Best regards,<br/>ChesTourism Team</p>
    `,
  });
}

export async function sendOrganizationRequestDecision(
  to: string,
  contactName: string,
  organizationName: string,
  approved: boolean,
  reason?: string,
): Promise<void> {
  const status = approved ? 'Approved' : 'Declined';
  const subject = approved
    ? `Your organization "${organizationName}" has been approved!`
    : `Update on your organization request for "${organizationName}"`;

  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject,
    htmlContent: `
      <h2>Organization Request ${status}</h2>
      <p>Dear ${contactName},</p>
      <p>Your request to register <strong>${organizationName}</strong> on ChesTourism has been <strong>${status.toLowerCase()}</strong>.</p>
      ${reason ? `<p>Reason: ${reason}</p>` : ''}
      ${approved
        ? `<p>Welcome aboard! You can now explore partnership opportunities on <a href="${BASE_URL}">ChesTourism</a>.</p>`
        : '<p>If you have questions, feel free to contact us or submit a new request.</p>'
      }
      <p>Best regards,<br/>ChesTourism Team</p>
    `,
  });
}

export async function sendDisputeAlertEmail(
  to: string,
  paymentId: string,
  disputeId: string,
  chargeId: string,
  amount: number,
  currency: string,
  reason: string,
): Promise<void> {
  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject: `[ACTION REQUIRED] Chargeback dispute opened — Payment #${paymentId}`,
    htmlContent: `
      <h2 style="color: #cc0000;">Chargeback Dispute Opened</h2>
      <p>A Stripe chargeback dispute has been filed. Immediate attention is required.</p>
      <table style="border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 4px 12px 4px 0; font-weight: bold;">Payment ID:</td>
          <td>${paymentId}</td>
        </tr>
        <tr>
          <td style="padding: 4px 12px 4px 0; font-weight: bold;">Dispute ID:</td>
          <td>${disputeId}</td>
        </tr>
        <tr>
          <td style="padding: 4px 12px 4px 0; font-weight: bold;">Charge ID:</td>
          <td>${chargeId}</td>
        </tr>
        <tr>
          <td style="padding: 4px 12px 4px 0; font-weight: bold;">Amount:</td>
          <td>${amount} ${currency.toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 4px 12px 4px 0; font-weight: bold;">Reason:</td>
          <td>${reason}</td>
        </tr>
      </table>
      <p>The payment status has been updated to <strong>DISPUTED</strong> in the system.</p>
      <p>Please log in to the Stripe Dashboard to review and respond to this dispute before the deadline.</p>
      <p style="color: #888; font-size: 12px;">This is an automated alert from ChesTourism.</p>
    `,
  });
}

export async function sendResultsWithCertificate(
  to: string,
  userName: string,
  tournamentName: string,
  place: number,
  eloChange: number,
  certificatePdf: Buffer,
): Promise<void> {
  const placeLabels: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' };
  const placeText = placeLabels[place] || `${place}th`;
  const eloText = eloChange >= 0 ? `+${eloChange}` : `${eloChange}`;

  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject: `Congratulations! ${placeText} Place in ${tournamentName}`,
    htmlContent: `
      <h2>Congratulations, ${userName}!</h2>
      <p>You achieved <strong>${placeText} place</strong> in <strong>${tournamentName}</strong>!</p>
      <p>ELO change: <strong>${eloText}</strong></p>
      <p>Your certificate of achievement is attached to this email.</p>
      <p>Best regards,<br/>ChesTourism Team</p>
    `,
    attachment: [
      {
        name: `certificate-${tournamentName.replace(/\s+/g, '-')}-${placeText}.pdf`,
        content: certificatePdf.toString('base64'),
      },
    ],
  });
}

// ─── Marketing emails (opt-out guarded + unsubscribe footer) ──────────────────

export async function sendTournamentInvite(
  to: string,
  userName: string,
  tournamentName: string,
  tournamentDate: string,
  registrationUrl: string,
): Promise<void> {
  if (await isEmailOptedOut(to)) return;

  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject: `You're invited to ${tournamentName}!`,
    htmlContent: `
      <h2>Tournament Invitation</h2>
      <p>Dear ${userName},</p>
      <p>You are invited to participate in <strong>${tournamentName}</strong>!</p>
      <p>Date: ${tournamentDate}</p>
      <p><a href="${registrationUrl}">Register Now</a></p>
      <p>We look forward to seeing you at the board!</p>
      <p>Best regards,<br/>ChesTourism Team</p>
      ${buildUnsubscribeFooter(to)}
    `,
  });
}

export async function sendTournamentResults(
  to: string,
  userName: string,
  tournamentName: string,
  place: number,
  eloChange: number,
): Promise<void> {
  if (await isEmailOptedOut(to)) return;

  const placeLabels: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' };
  const placeText = placeLabels[place] || `${place}th`;
  const eloText = eloChange >= 0 ? `+${eloChange}` : `${eloChange}`;

  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject: `Tournament Results: ${tournamentName}`,
    htmlContent: `
      <h2>Tournament Results</h2>
      <p>Dear ${userName},</p>
      <p>The results for <strong>${tournamentName}</strong> are in!</p>
      <p>Your placement: <strong>${placeText} place</strong></p>
      <p>ELO change: <strong>${eloText}</strong></p>
      ${place <= 3 ? '<p>Congratulations on your podium finish! Your certificate will be available for download in your profile.</p>' : ''}
      <p>Best regards,<br/>ChesTourism Team</p>
      ${buildUnsubscribeFooter(to)}
    `,
  });
}

export async function sendThankYouEmail(
  to: string,
  userName: string,
  tournamentName: string,
): Promise<void> {
  if (await isEmailOptedOut(to)) return;

  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject: `Thank you for participating in ${tournamentName}!`,
    htmlContent: `
      <h2>Thank You!</h2>
      <p>Dear ${userName},</p>
      <p>Thank you for participating in <strong>${tournamentName}</strong>!</p>
      <p>We hope you enjoyed the tournament and the experience.</p>
      <p>Check out upcoming tournaments on our platform and keep playing!</p>
      <p><a href="${BASE_URL}/tournaments">Browse Tournaments</a></p>
      <p>Best regards,<br/>ChesTourism Team</p>
      ${buildUnsubscribeFooter(to)}
    `,
  });
}

export async function sendScheduleChangeEmail(
  to: string,
  userName: string,
  tournament: {
    id: string;
    title: string;
    city: string;
    country: string;
    startDate: Date;
    endDate: Date;
  },
): Promise<void> {
  if (await isEmailOptedOut(to)) return;

  const startFormatted = tournament.startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const endFormatted = tournament.endDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const tournamentUrl = `${BASE_URL}/tournaments/${tournament.id}`;

  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject: `Schedule update: ${tournament.title}`,
    htmlContent: `
      <h2>Tournament Schedule Updated</h2>
      <p>Dear ${userName},</p>
      <p>The schedule for <strong>${tournament.title}</strong> has been updated.</p>
      <table style="border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 4px 12px 4px 0; font-weight: bold;">Location:</td>
          <td>${tournament.city}, ${tournament.country}</td>
        </tr>
        <tr>
          <td style="padding: 4px 12px 4px 0; font-weight: bold;">Starts:</td>
          <td>${startFormatted}</td>
        </tr>
        <tr>
          <td style="padding: 4px 12px 4px 0; font-weight: bold;">Ends:</td>
          <td>${endFormatted}</td>
        </tr>
      </table>
      <p><a href="${tournamentUrl}">View tournament details</a></p>
      <p>Best regards,<br/>ChesTourism Team</p>
      ${buildUnsubscribeFooter(to)}
    `,
  });
}

export async function sendAnnouncementEmail(
  to: string,
  tournamentTitle: string,
  announcementTitle: string,
  body: string,
): Promise<void> {
  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject: `[${tournamentTitle}] ${announcementTitle}`,
    htmlContent: `
      <h2>${announcementTitle}</h2>
      <p>${body.replace(/\n/g, '<br>')}</p>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e5e5;" />
      <small>Tournament: ${tournamentTitle}</small>
    `,
  });
}

export async function sendPaymentConfirmedEmail(
  to: string,
  userName: string,
  tournamentTitle: string,
  tournamentId: string,
): Promise<void> {
  if (await isEmailOptedOut(to)) return;

  const tournamentUrl = `${BASE_URL}/tournaments/${tournamentId}`;

  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject: `Payment confirmed for ${tournamentTitle}`,
    htmlContent: `
      <h2>Payment Confirmed</h2>
      <p>Dear ${userName},</p>
      <p>Your payment for <strong>${tournamentTitle}</strong> has been successfully processed. Your registration is now confirmed.</p>
      <p><a href="${tournamentUrl}">View tournament details</a></p>
      <p>Best regards,<br/>ChesTourism Team</p>
      ${buildUnsubscribeFooter(to)}
    `,
  });
}

export async function sendTournamentCancelledEmail(
  to: string,
  userName: string,
  tournamentTitle: string,
  commissionerEmail: string,
): Promise<void> {
  if (await isEmailOptedOut(to)) return;

  await brevoSend({
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject: `Tournament "${tournamentTitle}" has been cancelled`,
    htmlContent: `
      <h2>Tournament Cancelled</h2>
      <p>Dear ${userName},</p>
      <p>We regret to inform you that <strong>${tournamentTitle}</strong> has been cancelled.</p>
      <p>If you have paid a registration fee, please contact the tournament commissioner directly to arrange a refund:</p>
      <p><a href="mailto:${commissionerEmail}">${commissionerEmail}</a></p>
      <p>We apologise for the inconvenience and hope to see you at future tournaments.</p>
      <p><a href="${BASE_URL}/tournaments">Browse other tournaments</a></p>
      <p>Best regards,<br/>ChesTourism Team</p>
      ${buildUnsubscribeFooter(to)}
    `,
  });
}
