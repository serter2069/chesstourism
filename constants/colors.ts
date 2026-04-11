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
  // ELO change indicators
  eloPositive: '#1A7A3A',
  eloNegative: '#C0392B',

  // Medal colors
  silver: '#9EA3A8',
  bronze: '#CD7F32',

  // Semantic success/warning text (used in badges, banners)
  successGreen: '#1A6B3A',
  warningBrown: '#7A5C1E',

  // Admin dark theme
  adminBg: '#0f1318',
  adminCard: '#1a2030',
  adminText: '#e0e4ef',
  adminMuted: '#8090a8',
  adminAccent: '#e07070',
  adminBorder: '#2a3040',
  adminGreen: '#4caf50',
  adminYellow: '#ffc107',
  adminBlue: '#6b9fd4',
  adminRed: '#e07070',
  adminInputBg: '#141a28',
  adminAlertBg: '#2d2a1a',
  adminAlertBorder: '#5a4a1a',
  adminIconBg: '#2a1a2a',
  adminDangerBg: '#3a1a1a',
  adminApproveBg: '#1a3a1a',

  // Skeleton placeholder
  skeleton: '#E8ECF0',

  // Highlight row
  highlightWarm: '#FDF8F0',

  // Table header text (semi-transparent white on dark bg)
  tableHeaderText: 'rgba(255,255,255,0.6)',
  tableHeaderTextFaint: 'rgba(255,255,255,0.1)',
  lightTextOnDark: 'rgba(255,255,255,0.7)',

  // Modal overlay
  overlay: 'rgba(0,0,0,0.5)',

} as const

export type Color = keyof typeof Colors
