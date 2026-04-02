// Brand color tokens — FIDE Navy Gold palette (prestigious, classic chess federation)
export const Colors = {
  // Backgrounds
  bgPrimary: '#F5F1E8',
  bgSecondary: '#FAF7F2',
  bgSurface: '#FAF7F2',
  bgCard: '#FFFFFF',

  // Text
  textPrimary: '#0D1B3E',
  textSecondary: '#5C6B8A',
  textMuted: '#5C6B8A',
  textAccent: '#C59A1A',

  // Borders
  borderDefault: '#DDE3ED',
  borderFocus: '#C59A1A',

  // Brand
  brandPrimary: '#0D1B3E',
  brandAccent: '#C59A1A',
  brandSecondary: '#1A2D5A',

  // Status
  statusSuccess: '#27AE60',
  statusWarning: '#E2A83E',
  statusError: '#C0392B',
  statusInfo: '#2563EB',

  // On-color text
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#0D1B3E',
} as const;

export type ColorKey = keyof typeof Colors;
