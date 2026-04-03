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

  // Status colors — derived from brand palette
  statusSuccessBg: '#EAF3E8',
  statusSuccessText: '#1A2B4A',
  statusWarningBg: '#FDF5E6',
  statusWarningText: '#7A5C1E',
  statusErrorBg: '#FAEAEA',
  statusErrorText: '#C0392B',
  statusInfoBg: '#EEF1F8',
  statusInfoText: '#1A2B4A',
  statusUnreadBg: '#EEF1F8',
  statusApprovedBg: '#EAF3E8',
  statusRejectedBg: '#FAEAEA',
  white: '#FFFFFF',
} as const

export type Color = keyof typeof Colors
