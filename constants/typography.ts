// Typography tokens — Clay palette (Nunito, warm and handcrafted)
export const Typography = {
  fontFamily: 'Nunito_400Regular',
  fontFamilySemiBold: 'Nunito_600SemiBold',
  fontFamilyBold: 'Nunito_700Bold',
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
