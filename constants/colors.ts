export const Colors = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundAlt: '#F5F6FA',

  // Brand
  primary: '#1A2B4A',
  gold: '#C8A96E',

  // Text
  text: '#0D1B3E',
  textMuted: '#6B7A99',

  // System
  error: '#C0392B',
  border: '#DDE1EC',
} as const

export type Color = keyof typeof Colors
