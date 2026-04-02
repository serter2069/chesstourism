// Brand color tokens — Navy + Gold palette (Official Chess Federation)
export const Colors = {
  // Backgrounds
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F5F6FA',
  bgSurface: '#F5F6FA',
  bgCard: '#FFFFFF',

  // Text
  textPrimary: '#0D1B3E',
  textSecondary: '#3D4F6E',
  textMuted: '#6B7A99',
  textAccent: '#C8A96E',

  // Borders
  borderDefault: '#DDE1EC',
  borderFocus: '#C8A96E',

  // Brand
  brandPrimary: '#1A2B4A',
  brandAccent: '#C8A96E',
  brandSecondary: '#3D4F6E',

  // Status
  statusSuccess: '#1A7A4A',
  statusWarning: '#B8860B',
  statusError: '#C0392B',
  statusInfo: '#1A5276',

  // On-color text
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',

  // Accent
  accentLight: '#E8D5A3',
} as const;

export type ColorKey = keyof typeof Colors;
