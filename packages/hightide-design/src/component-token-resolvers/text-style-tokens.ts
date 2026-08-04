import type { ColorToken } from '../primitive-tokens/color'
import type { FontWeightToken } from '../primitive-tokens/typography'

export type TextStyleTokens = {
  color?: ColorToken,
  fontSize?: number,
  lineHeight?: number,
  fontWeight?: FontWeightToken,
  fontFamily?: string,
}
