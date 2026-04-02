// Brand color tokens — Clay palette (warm, handcrafted, chess tournament feeling)
export const Colors = {
  // Backgrounds
  bgPrimary: '#FAF2EC',
  bgSecondary: '#F2E8E0',
  bgSurface: '#F2E8E0',
  bgCard: '#FAF2EC',

  // Text
  textPrimary: '#2A1510',
  textSecondary: '#6B4F45',
  textMuted: '#9A7060',
  textAccent: '#C4664A',

  // Borders
  borderDefault: '#D9C9BF',
  borderFocus: '#C4664A',

  // Brand
  brandPrimary: '#C4664A',
  brandSecondary: '#A8523A',

  // Status
  statusSuccess: '#5A8A5C',
  statusWarning: '#C4884A',
  statusError: '#D94F3D',
  statusInfo: '#6B8A9A',
} as const;

export type ColorKey = keyof typeof Colors;
