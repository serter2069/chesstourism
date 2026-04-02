import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const FROM_EMAIL = process.env.SMTP_FROM || 'noreply@chesstourism.com';
const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: 'Your ChesTourism login code',
    html: `
      <h2>Your Login Code</h2>
      <p>Use the code below to sign in to ChesTourism:</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center;">${code}</p>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}

export async function sendTournamentInvite(
  to: string,
  userName: string,
  tournamentName: string,
  tournamentDate: string,
  registrationUrl: string,
): Promise<void> {
  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `You're invited to ${tournamentName}!`,
    html: `
      <h2>Tournament Invitation</h2>
      <p>Dear ${userName},</p>
      <p>You are invited to participate in <strong>${tournamentName}</strong>!</p>
      <p>Date: ${tournamentDate}</p>
      <p><a href="${registrationUrl}">Register Now</a></p>
      <p>We look forward to seeing you at the board!</p>
      <p>Best regards,<br/>ChesTourism Team</p>
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

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html: `
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

export async function sendTournamentResults(
  to: string,
  userName: string,
  tournamentName: string,
  place: number,
  eloChange: number,
): Promise<void> {
  const placeLabels: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' };
  const placeText = placeLabels[place] || `${place}th`;
  const eloText = eloChange >= 0 ? `+${eloChange}` : `${eloChange}`;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `Tournament Results: ${tournamentName}`,
    html: `
      <h2>Tournament Results</h2>
      <p>Dear ${userName},</p>
      <p>The results for <strong>${tournamentName}</strong> are in!</p>
      <p>Your placement: <strong>${placeText} place</strong></p>
      <p>ELO change: <strong>${eloText}</strong></p>
      ${place <= 3 ? '<p>Congratulations on your podium finish! Your certificate will be available for download in your profile.</p>' : ''}
      <p>Best regards,<br/>ChesTourism Team</p>
    `,
  });
}

export async function sendThankYouEmail(
  to: string,
  userName: string,
  tournamentName: string,
): Promise<void> {
  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `Thank you for participating in ${tournamentName}!`,
    html: `
      <h2>Thank You!</h2>
      <p>Dear ${userName},</p>
      <p>Thank you for participating in <strong>${tournamentName}</strong>!</p>
      <p>We hope you enjoyed the tournament and the experience.</p>
      <p>Check out upcoming tournaments on our platform and keep playing!</p>
      <p><a href="${BASE_URL}/tournaments">Browse Tournaments</a></p>
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

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html: `
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

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `Congratulations! ${placeText} Place in ${tournamentName}`,
    html: `
      <h2>Congratulations, ${userName}!</h2>
      <p>You achieved <strong>${placeText} place</strong> in <strong>${tournamentName}</strong>!</p>
      <p>ELO change: <strong>${eloText}</strong></p>
      <p>Your certificate of achievement is attached to this email.</p>
      <p>Best regards,<br/>ChesTourism Team</p>
    `,
    attachments: [
      {
        filename: `certificate-${tournamentName.replace(/\s+/g, '-')}-${placeText}.pdf`,
        content: certificatePdf,
        contentType: 'application/pdf',
      },
    ],
  });
}
