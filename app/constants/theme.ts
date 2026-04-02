/**
 * Navy + Gold — Brand Design System (canonical reference)
 * Official Chess Federation palette.
 *
 * This file is the single source of truth for brand tokens.
 * The root constants/ files (colors.ts, typography.ts, spacing.ts)
 * are kept in sync and used by components via shorter imports.
 */

import { Colors } from '../../constants/colors'

export const colors = {
  primary: Colors.primary,
  accent: Colors.gold,
  background: Colors.background,
  surface: Colors.backgroundAlt,
  text: Colors.text,
  textMuted: Colors.textMuted,
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',
  border: Colors.border,
  error: Colors.error,
} as const;

export const fonts = {
  heading: 'PlayfairDisplay_700Bold',
  headingSemiBold: 'PlayfairDisplay_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
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
