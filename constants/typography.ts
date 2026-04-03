// Typography tokens — Navy + Gold palette (Playfair Display headings, Inter body)
export const Typography = {
  // Heading font (Playfair Display — authoritative, editorial)
  fontFamilyHeading: 'PlayfairDisplay_700Bold',
  fontFamilyHeadingSemiBold: 'PlayfairDisplay_400Regular',

  // Body font (Inter — clean, modern, highly legible)
  fontFamily: 'Inter_400Regular',
  fontFamilyMedium: 'Inter_500Medium',
  fontFamilySemiBold: 'Inter_600SemiBold',
  fontFamilyBold: 'Inter_700Bold',

  // Legacy aliases (backwards compat)
  fontFamilyExtraBold: 'PlayfairDisplay_700Bold',

  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    // Icon sizes (emoji/chess pieces in UI)
    icon: 48,
    iconLg: 56,
  },

  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;
