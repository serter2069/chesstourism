// Typography tokens — Clay palette (Nunito throughout, source: brand.html)
export const Typography = {
  // Heading font (Nunito — warm, rounded, friendly)
  fontFamilyHeading: 'Nunito_800ExtraBold',
  fontFamilyHeadingSemiBold: 'Nunito_600SemiBold',

  // Body font (Nunito — consistent with headings per brand.html)
  fontFamily: 'Nunito_400Regular',
  fontFamilyMedium: 'Nunito_600SemiBold',
  fontFamilySemiBold: 'Nunito_600SemiBold',
  fontFamilyBold: 'Nunito_700Bold',

  // Legacy aliases (backwards compat)
  fontFamilyExtraBold: 'Nunito_800ExtraBold',

  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
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
