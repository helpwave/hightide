import { TokenBuilder } from '../../utils'
import type { HexColor } from '../../utils/hex-color'
import type { FontSizingToken as PrimitiveFontSizingToken } from '../../primitive-tokens/font-sizing-token'
import type { ColorPairToken, FontSizingToken } from './theme-tokens-config'

export const colorPair = (color: HexColor, onColor: HexColor): ColorPairToken => ({
  color: TokenBuilder.color(color),
  onColor: TokenBuilder.color(onColor),
})

export const wrapFontSizing = (
  sizing: PrimitiveFontSizingToken
): FontSizingToken => ({
  fontSize: sizing.fontSize,
  lineHeight: sizing.lineHeight,
})
