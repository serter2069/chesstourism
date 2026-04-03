import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

// Brand palette — matches constants/colors.ts
const C = {
  primary:       '#1A2B4A',
  gold:          '#C8A96E',
  background:    '#FFFFFF',
  backgroundAlt: '#F5F6FA',
  text:          '#0D1B3E',
  textMuted:     '#6B7A99',
  border:        '#DDE1EC',
} as const;

export interface ParticipationCertificateOptions {
  participantName: string;
  tournamentName: string;
  tournamentDate: string;
  place?: number;
  commissionerName?: string;
}

export function generateParticipationCertificate(
  opts: ParticipationCertificateOptions,
): Promise<Buffer> {
  const { participantName, tournamentName, tournamentDate, place, commissionerName } = opts;

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50,
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err: Error) => reject(err));

    // Outer border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .stroke(C.gold);

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(1)
      .stroke(C.gold);

    // Background fill (subtle)
    doc.rect(31, 31, doc.page.width - 62, doc.page.height - 62)
      .fillOpacity(0.05)
      .fill(C.backgroundAlt);

    // Reset fill opacity for text
    doc.fillOpacity(1);

    // Association name
    doc.fontSize(13)
      .fillColor(C.gold)
      .text('International Chess Tourism Association', 0, 60, { align: 'center' });

    // Title
    doc.fontSize(36)
      .fillColor(C.primary)
      .text('Certificate of Participation', 0, 100, { align: 'center' });

    // Decorative line
    const centerX = doc.page.width / 2;
    doc.moveTo(centerX - 150, 155)
      .lineTo(centerX + 150, 155)
      .lineWidth(2)
      .stroke(C.gold);

    // Body
    doc.fontSize(16)
      .fillColor(C.primary)
      .text('This certifies that', 0, 180, { align: 'center' });

    doc.fontSize(28)
      .fillColor(C.gold)
      .text(participantName, 0, 210, { align: 'center' });

    doc.fontSize(16)
      .fillColor(C.primary)
      .text('has participated in the tournament', 0, 255, { align: 'center' });

    doc.fontSize(22)
      .fillColor(C.primary)
      .text(tournamentName, 0, 285, { align: 'center' });

    // Place (if available)
    if (place) {
      const placeLabels: Record<number, string> = { 1: '1st Place', 2: '2nd Place', 3: '3rd Place' };
      const placeLabel = placeLabels[place] ?? `${place}th Place`;
      doc.fontSize(18)
        .fillColor(C.gold)
        .text(placeLabel, 0, 325, { align: 'center' });
    }

    const dateY = place ? 360 : 335;
    doc.fontSize(12)
      .fillColor(C.textMuted)
      .text(`Date: ${tournamentDate}`, 0, dateY, { align: 'center' });

    // Commissioner signature line
    if (commissionerName) {
      const sigY = dateY + 50;
      doc.moveTo(centerX - 80, sigY)
        .lineTo(centerX + 80, sigY)
        .lineWidth(1)
        .stroke(C.border);
      doc.fontSize(11)
        .fillColor(C.textMuted)
        .text(commissionerName, 0, sigY + 5, { align: 'center' });
      doc.fontSize(10)
        .fillColor(C.textMuted)
        .text('Tournament Commissioner', 0, sigY + 18, { align: 'center' });
    }

    // Chess symbols decoration
    doc.fontSize(22)
      .fillColor(C.backgroundAlt)
      .stroke(C.gold)
      .text('\u2654 \u2655 \u2656 \u2657 \u2658 \u2659', 0, doc.page.height - 70, { align: 'center' });

    doc.end();
  });
}


export function generateCertificate(
  userName: string,
  tournamentName: string,
  place: number,
  date: string,
): Promise<Buffer> {
  const placeLabels: Record<number, string> = {
    1: '1st Place',
    2: '2nd Place',
    3: '3rd Place',
  };

  const placeLabel = placeLabels[place];
  if (!placeLabel) {
    return Promise.reject(new Error('Certificates are only generated for places 1, 2, and 3'));
  }

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50,
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err: Error) => reject(err));

    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .stroke(C.primary);

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(1)
      .stroke(C.gold);

    // Title
    doc.fontSize(14)
      .fillColor(C.textMuted)
      .text('International Chess Tourism Association', 0, 60, { align: 'center' });

    doc.moveDown(1);
    doc.fontSize(36)
      .fillColor(C.primary)
      .text('Certificate of Achievement', 0, 100, { align: 'center' });

    // Decorative line
    const centerX = doc.page.width / 2;
    doc.moveTo(centerX - 150, 155)
      .lineTo(centerX + 150, 155)
      .lineWidth(2)
      .stroke(C.gold);

    // Body
    doc.fontSize(16)
      .fillColor(C.text)
      .text('This certifies that', 0, 180, { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(28)
      .fillColor(C.primary)
      .text(userName, 0, 210, { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(16)
      .fillColor(C.text)
      .text('has achieved', 0, 255, { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(32)
      .fillColor(C.gold)
      .text(placeLabel, 0, 285, { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(16)
      .fillColor(C.text)
      .text('in the tournament', 0, 335, { align: 'center' });

    doc.moveDown(0.3);
    doc.fontSize(22)
      .fillColor(C.primary)
      .text(tournamentName, 0, 365, { align: 'center' });

    doc.moveDown(1);
    doc.fontSize(12)
      .fillColor(C.textMuted)
      .text(`Date: ${date}`, 0, 410, { align: 'center' });

    // Chess symbols decoration
    doc.fontSize(24)
      .fillColor(C.border)
      .text('\u2654 \u2655 \u2656 \u2657 \u2658 \u2659', 0, 450, { align: 'center' });

    doc.end();
  });
}

// Brand colors: primary=#1A2B4A (navy), gold=#C8A96E, background=#FFFFFF, text=#0D1B3E
export async function generateMembershipCertificate(
  memberName: string,
  memberEmail: string,
  memberNumber: string,
  validFrom: Date,
  validUntil: Date,
  profileUrl: string,
): Promise<Buffer> {
  // Generate QR code as PNG data URL
  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    width: 120,
    margin: 1,
    color: { dark: C.primary, light: C.background },
  });
  // Strip the data:image/png;base64, prefix to get raw buffer
  const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');
  const qrBuffer = Buffer.from(qrBase64, 'base64');

  function formatDate(d: Date): string {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'portrait',
      margin: 0,
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err: Error) => reject(err));

    const W = doc.page.width;   // 595
    const H = doc.page.height;  // 842

    // Background
    doc.rect(0, 0, W, H).fill(C.background);

    // Outer border
    doc.rect(18, 18, W - 36, H - 36)
      .lineWidth(3)
      .stroke(C.gold);

    // Inner border
    doc.rect(26, 26, W - 52, H - 52)
      .lineWidth(1)
      .stroke(C.primary);

    // Header band
    doc.rect(26, 26, W - 52, 70)
      .fill(C.primary);

    // Org name in header
    doc.fontSize(10)
      .fillColor(C.background)
      .text('INTERNATIONAL CHESS TOURISM FEDERATION', 0, 44, { align: 'center', characterSpacing: 2 });

    // Certificate title
    doc.fontSize(30)
      .fillColor(C.primary)
      .text('Certificate', 0, 120, { align: 'center' });

    doc.fontSize(14)
      .fillColor(C.gold)
      .text('OF MEMBERSHIP', 0, 158, { align: 'center', characterSpacing: 3 });

    // Decorative accent line
    const cx = W / 2;
    doc.moveTo(cx - 140, 188).lineTo(cx + 140, 188).lineWidth(1).stroke(C.gold);

    // Certifies text
    doc.fontSize(12)
      .fillColor(C.textMuted)
      .text('This is to certify that', 0, 204, { align: 'center' });

    // Member name
    doc.fontSize(28)
      .fillColor(C.primary)
      .text(memberName, 0, 226, { align: 'center' });

    // Member email
    doc.fontSize(11)
      .fillColor(C.textMuted)
      .text(memberEmail, 0, 262, { align: 'center' });

    // Body text
    doc.fontSize(12)
      .fillColor(C.text)
      .text(
        'is a registered member of the International Chess Tourism Federation\nand is entitled to all rights and privileges of full membership.',
        60, 296,
        { align: 'center', width: W - 120, lineGap: 4 },
      );

    // Membership card panel
    const cardX = 80;
    const cardY = 366;
    const cardW = W - 160;
    const cardH = 110;
    doc.roundedRect(cardX, cardY, cardW, cardH, 6).fill(C.primary);

    // Card fields
    const col1X = cardX + 28;
    const col2X = cardX + cardW / 2 - 50;
    const col3X = cardX + cardW - 170;
    const labelY = cardY + 18;
    const valueY = cardY + 36;

    doc.fontSize(8).fillColor(C.gold);
    doc.text('MEMBER NO.', col1X, labelY, { characterSpacing: 1 });
    doc.text('VALID FROM', col2X, labelY, { characterSpacing: 1 });
    doc.text('VALID UNTIL', col3X, labelY, { characterSpacing: 1 });

    doc.fontSize(13).fillColor(C.background);
    doc.text(memberNumber, col1X, valueY);
    doc.text(formatDate(validFrom), col2X, valueY);
    doc.text(formatDate(validUntil), col3X, valueY);

    // Active badge
    const badgeText = 'ACTIVE MEMBER';
    const badgeW = 110;
    const badgeX = cardX + (cardW - badgeW) / 2;
    const badgeY = cardY + 72;
    doc.roundedRect(badgeX, badgeY, badgeW, 20, 10).fill(C.gold);
    doc.fontSize(8).fillColor(C.primary)
      .text(badgeText, badgeX, badgeY + 6, { width: badgeW, align: 'center', characterSpacing: 1 });

    // QR code — bottom right area
    const qrSize = 90;
    const qrX = W - 80 - qrSize;
    const qrY = cardY + cardH + 28;
    doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
    doc.fontSize(7).fillColor(C.textMuted)
      .text('Scan to verify', qrX, qrY + qrSize + 4, { width: qrSize, align: 'center' });

    // Chess symbols decoration (left of QR)
    doc.fontSize(20).fillColor(C.gold)
      .text('\u2654 \u2655 \u2656 \u2657 \u2658 \u2659', 60, qrY + 30, { width: qrX - 80 });

    // Footer line
    const footerY = H - 60;
    doc.moveTo(40, footerY).lineTo(W - 40, footerY).lineWidth(0.5).stroke(C.gold);

    doc.fontSize(9).fillColor(C.textMuted)
      .text(
        'International Chess Tourism Federation  \u2022  chesstourism.smartlaunchhub.com',
        0, footerY + 10,
        { align: 'center' },
      );

    doc.end();
  });
}
