// Brand color tokens — source: Trinity brand #36
export const Colors = {
  // Backgrounds
  bgPrimary: '#0f0f1a',
  bgSecondary: '#1a1a2e',
  bgSurface: '#16213e',
  bgCard: '#1e1e35',

  // Text
  textPrimary: '#e2e8f0',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textAccent: '#a78bfa',

  // Borders
  borderDefault: '#2d2d4e',
  borderFocus: '#6366f1',

  // Brand
  brandPrimary: '#6366f1',
  brandSecondary: '#8b5cf6',

  // Status
  statusSuccess: '#4CAF50',
  statusWarning: '#f59e0b',
  statusError: '#ef4444',
  statusInfo: '#3b82f6',
} as const;

export type ColorKey = keyof typeof Colors;
