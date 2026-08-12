export type FontSizeKey =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl'

export type FontWeightKey = 'thin' | 'light' | 'base' | 'medium' | 'semibold' | 'bold'

export type FontWeightToken = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

export type HightideTypographyPrimitiveTokens = {
  fontFamily: Record<string, string>,
  fontSize: Record<FontSizeKey, number> & Record<string, number>,
  fontWeight: Record<FontWeightKey, FontWeightToken> & Record<string, FontWeightToken>,
  lineHeight: Record<FontSizeKey, number | string> & Record<string, number | string>,
}

export const hightideTypography = {
  fontFamily: {
    inter: 'Inter',
    spaceGrotesk: 'Space Grotesk',
  },
  fontSize: {
    'xs': 12,
    'sm': 14,
    'base': 16,
    'lg': 18,
    'xl': 20,
    '2xl': 22,
    '3xl': 24,
    '4xl': 32,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
    '9xl': 128,
  },
  fontWeight: {
    thin: '100',
    light: '300',
    base: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    'xs': 16,
    'sm': 18,
    'base': 20,
    'lg': 24,
    'xl': 28,
    '2xl': 28,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
    '9xl': 128,
  },
} as const satisfies HightideTypographyPrimitiveTokens
