/**
 * FIDE Navy Gold — Brand Design System
 * Source: public/brand.html + public/palette.html
 */

export const colors = {
  primary: '#0D1B3E',
  primaryLight: '#1A2D5A',
  accent: '#C59A1A',
  accentLight: '#D4AF37',
  background: '#F5F1E8',
  surface: '#FAF7F2',
  surfaceWhite: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#5C6B8A',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#0D1B3E',
  border: '#DDE3ED',
  error: '#C0392B',
  success: '#27AE60',
} as const;

export const fonts = {
  heading: 'PlayfairDisplay_700Bold',
  headingSemiBold: 'PlayfairDisplay_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

export const fontFamilies = {
  heading: 'PlayfairDisplay_700Bold',
  body: 'Inter_400Regular',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const borderRadius = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  card: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardElevated: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const typography = {
  h1: {
    fontFamily: fonts.heading,
    fontSize: 38,
    lineHeight: 46,
    color: colors.primary,
  },
  h2: {
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 34,
    color: colors.primary,
  },
  h3: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 19,
    lineHeight: 26,
    color: colors.primary,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 26,
    color: colors.text,
  },
  bodySmall: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
  },
  caption: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: colors.textMuted,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.primary,
  },
} as const;

const theme = {
  colors,
  fonts,
  fontFamilies,
  spacing,
  borderRadius,
  shadows,
  typography,
} as const;

export default theme;
