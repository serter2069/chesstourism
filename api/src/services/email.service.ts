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

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verifyUrl = `${BASE_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your ChesTourism account',
    html: `
      <h2>Welcome to ChesTourism!</h2>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset your ChesTourism password',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
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
