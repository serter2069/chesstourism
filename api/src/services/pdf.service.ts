import PDFDocument from 'pdfkit';

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
      .stroke('#C4664A');

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(1)
      .stroke('#C4664A');

    // Background fill (subtle)
    doc.rect(31, 31, doc.page.width - 62, doc.page.height - 62)
      .fillOpacity(0.05)
      .fill('#FAF2EC');

    // Reset fill opacity for text
    doc.fillOpacity(1);

    // Association name
    doc.fontSize(13)
      .fillColor('#C4664A')
      .text('International Chess Tourism Association', 0, 60, { align: 'center' });

    // Title
    doc.fontSize(36)
      .fillColor('#2A1510')
      .text('Certificate of Participation', 0, 100, { align: 'center' });

    // Decorative line
    const centerX = doc.page.width / 2;
    doc.moveTo(centerX - 150, 155)
      .lineTo(centerX + 150, 155)
      .lineWidth(2)
      .stroke('#C4664A');

    // Body
    doc.fontSize(16)
      .fillColor('#2A1510')
      .text('This certifies that', 0, 180, { align: 'center' });

    doc.fontSize(28)
      .fillColor('#C4664A')
      .text(participantName, 0, 210, { align: 'center' });

    doc.fontSize(16)
      .fillColor('#2A1510')
      .text('has participated in the tournament', 0, 255, { align: 'center' });

    doc.fontSize(22)
      .fillColor('#2A1510')
      .text(tournamentName, 0, 285, { align: 'center' });

    // Place (if available)
    if (place) {
      const placeLabels: Record<number, string> = { 1: '1st Place', 2: '2nd Place', 3: '3rd Place' };
      const placeLabel = placeLabels[place] ?? `${place}th Place`;
      doc.fontSize(18)
        .fillColor('#C4664A')
        .text(placeLabel, 0, 325, { align: 'center' });
    }

    const dateY = place ? 360 : 335;
    doc.fontSize(12)
      .fillColor('#666')
      .text(`Date: ${tournamentDate}`, 0, dateY, { align: 'center' });

    // Commissioner signature line
    if (commissionerName) {
      const sigY = dateY + 50;
      doc.moveTo(centerX - 80, sigY)
        .lineTo(centerX + 80, sigY)
        .lineWidth(1)
        .stroke('#999');
      doc.fontSize(11)
        .fillColor('#666')
        .text(commissionerName, 0, sigY + 5, { align: 'center' });
      doc.fontSize(10)
        .fillColor('#999')
        .text('Tournament Commissioner', 0, sigY + 18, { align: 'center' });
    }

    // Chess symbols decoration
    doc.fontSize(22)
      .fillColor('#FAF2EC')
      .stroke('#C4664A')
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
      .stroke('#1a365d');

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(1)
      .stroke('#2b6cb0');

    // Title
    doc.fontSize(14)
      .fillColor('#666')
      .text('International Chess Tourism Association', 0, 60, { align: 'center' });

    doc.moveDown(1);
    doc.fontSize(36)
      .fillColor('#1a365d')
      .text('Certificate of Achievement', 0, 100, { align: 'center' });

    // Decorative line
    const centerX = doc.page.width / 2;
    doc.moveTo(centerX - 150, 155)
      .lineTo(centerX + 150, 155)
      .lineWidth(2)
      .stroke('#c6a84b');

    // Body
    doc.fontSize(16)
      .fillColor('#333')
      .text('This certifies that', 0, 180, { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(28)
      .fillColor('#1a365d')
      .text(userName, 0, 210, { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(16)
      .fillColor('#333')
      .text('has achieved', 0, 255, { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(32)
      .fillColor('#c6a84b')
      .text(placeLabel, 0, 285, { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(16)
      .fillColor('#333')
      .text('in the tournament', 0, 335, { align: 'center' });

    doc.moveDown(0.3);
    doc.fontSize(22)
      .fillColor('#1a365d')
      .text(tournamentName, 0, 365, { align: 'center' });

    doc.moveDown(1);
    doc.fontSize(12)
      .fillColor('#666')
      .text(`Date: ${date}`, 0, 410, { align: 'center' });

    // Chess symbols decoration
    doc.fontSize(24)
      .fillColor('#ddd')
      .text('\u2654 \u2655 \u2656 \u2657 \u2658 \u2659', 0, 450, { align: 'center' });

    doc.end();
  });
}
