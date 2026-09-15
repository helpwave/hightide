import type { FontFamilyToken } from '../font-family-token'
import type { FontSizeKey, FontSizingToken } from '../font-sizing-token'
import type { FontWeightKey, FontWeightToken } from '../font-weight-token'
import { TokenBuilder } from '../../utils'

export type HightideTypographyPrimitiveTokens = {
  fontFamily: Record<string, FontFamilyToken>,
  fontWeight: Record<FontWeightKey, FontWeightToken> & Record<string, FontWeightToken>,
  fontSizing: Record<FontSizeKey, FontSizingToken> & Record<string, FontSizingToken>,
}

export const hightideTypography = {
  fontFamily: {
    inter: TokenBuilder.fontFamily('Inter'),
    spaceGrotesk: TokenBuilder.fontFamily('SpaceGrotesk'),
  },
  fontWeight: {
    thin: TokenBuilder.fontWeight(100),
    light: TokenBuilder.fontWeight(300),
    base: TokenBuilder.fontWeight(400),
    medium: TokenBuilder.fontWeight(500),
    semibold: TokenBuilder.fontWeight(600),
    bold: TokenBuilder.fontWeight(700),
  },
  fontSizing: {
    'xs': { fontSize: TokenBuilder.number(12), lineHeight: TokenBuilder.number(16) },
    'sm': { fontSize: TokenBuilder.number(14), lineHeight: TokenBuilder.number(18) },
    'base': { fontSize: TokenBuilder.number(16), lineHeight: TokenBuilder.number(20) },
    'lg': { fontSize: TokenBuilder.number(18), lineHeight: TokenBuilder.number(24) },
    'xl': { fontSize: TokenBuilder.number(20), lineHeight: TokenBuilder.number(28) },
    '2xl': { fontSize: TokenBuilder.number(22), lineHeight: TokenBuilder.number(28) },
    '3xl': { fontSize: TokenBuilder.number(24), lineHeight: TokenBuilder.number(32) },
    '4xl': { fontSize: TokenBuilder.number(32), lineHeight: TokenBuilder.number(40) },
    '5xl': { fontSize: TokenBuilder.number(48), lineHeight: TokenBuilder.number(48) },
    '6xl': { fontSize: TokenBuilder.number(60), lineHeight: TokenBuilder.number(60) },
    '7xl': { fontSize: TokenBuilder.number(72), lineHeight: TokenBuilder.number(72) },
    '8xl': { fontSize: TokenBuilder.number(96), lineHeight: TokenBuilder.number(96) },
    '9xl': { fontSize: TokenBuilder.number(128), lineHeight: TokenBuilder.number(128) },
  },
} as const satisfies HightideTypographyPrimitiveTokens
