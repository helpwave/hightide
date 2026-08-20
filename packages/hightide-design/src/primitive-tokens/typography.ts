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

export type FontWeightToken = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type FontSizingToken = {
  fontSize: number,
  lineHeight: number,
}

export type HightideTypographyPrimitiveTokens = {
  fontFamily: Record<string, string>,
  fontWeight: Record<FontWeightKey, FontWeightToken> & Record<string, FontWeightToken>,
  fontSizing: Record<FontSizeKey, FontSizingToken> & Record<string, FontSizingToken>,
}

export const hightideTypography = {
  fontFamily: {
    inter: 'Inter',
    spaceGrotesk: 'SpaceGrotesk',
  },
  fontWeight: {
    thin: 100,
    light: 300,
    base: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSizing: {
    'xs': { fontSize: 12, lineHeight: 16 },
    'sm': { fontSize: 14, lineHeight: 18 },
    'base': { fontSize: 16, lineHeight: 20 },
    'lg': { fontSize: 18, lineHeight: 24 },
    'xl': { fontSize: 20, lineHeight: 28 },
    '2xl': { fontSize: 22, lineHeight: 28 },
    '3xl': { fontSize: 24, lineHeight: 32 },
    '4xl': { fontSize: 32, lineHeight: 40 },
    '5xl': { fontSize: 48, lineHeight: 48 },
    '6xl': { fontSize: 60, lineHeight: 60 },
    '7xl': { fontSize: 72, lineHeight: 72 },
    '8xl': { fontSize: 96, lineHeight: 96 },
    '9xl': { fontSize: 128, lineHeight: 128 },
  },
} as const satisfies HightideTypographyPrimitiveTokens
