import type { ColorToken } from '../primitive-tokens/color'
import type { FontWeightToken } from '../primitive-tokens/typography'

export type TextAlignToken = 'left' | 'center' | 'right'

export type TextStyleTokens = {
  color?: ColorToken,
  fontSize?: number,
  lineHeight?: number,
  fontWeight?: FontWeightToken,
  fontFamily?: string,
  textAlign?: TextAlignToken,
  flex?: number,
  flexShrink?: number,
}
