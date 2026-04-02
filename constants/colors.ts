// Brand color tokens — Clay palette (warm terracotta, source: brand.html)
export const Colors = {
  // Backgrounds
  bgPrimary: '#FAF2EC',
  bgSecondary: '#F2E8E0',
  bgSurface: '#F2E8E0',
  bgCard: '#FFFFFF',

  // Text
  textPrimary: '#2A1510',
  textSecondary: '#5A3528',
  textMuted: '#9A7060',
  textAccent: '#C4664A',

  // Borders
  borderDefault: '#DDD0C8',
  borderFocus: '#C4664A',

  // Brand
  brandPrimary: '#2A1510',
  brandAccent: '#C4664A',
  brandSecondary: '#5A3528',

  // Status
  statusSuccess: '#27AE60',
  statusWarning: '#E2A83E',
  statusError: '#C0392B',
  statusInfo: '#2563EB',

  // On-color text
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',
} as const;

export type ColorKey = keyof typeof Colors;
