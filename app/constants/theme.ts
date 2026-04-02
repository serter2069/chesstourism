/**
 * Clay — Brand Design System (canonical reference)
 * Source: public/brand.html
 *
 * This file is the single source of truth for brand tokens.
 * The root constants/ files (colors.ts, typography.ts, spacing.ts)
 * are kept in sync and used by components via shorter imports.
 */

export const colors = {
  primary: '#2A1510',
  primaryLight: '#5A3528',
  accent: '#C4664A',
  accentLight: '#D8886A',
  background: '#FAF2EC',
  surface: '#F2E8E0',
  surfaceWhite: '#FFFFFF',
  text: '#2A1510',
  textMuted: '#9A7060',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',
  border: '#DDD0C8',
  error: '#C0392B',
  success: '#27AE60',
} as const;

export const fonts = {
  heading: 'Nunito_800ExtraBold',
  headingSemiBold: 'Nunito_600SemiBold',
  body: 'Nunito_400Regular',
  bodyMedium: 'Nunito_600SemiBold',
  bodySemiBold: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
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
  spacing,
  borderRadius,
  shadows,
  typography,
} as const;

export default theme;
