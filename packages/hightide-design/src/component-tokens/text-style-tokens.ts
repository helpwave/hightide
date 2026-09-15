import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { FontFamilyToken } from '../primitive-tokens/font-family-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { TextAlignToken } from '../primitive-tokens/text-align-token'

export type TextStyleTokens = {
  type: 'textStyle',
  color?: ColorValueToken,
  fontSize?: NumberValueToken,
  lineHeight?: NumberValueToken,
  fontWeight?: NumberValueToken,
  fontFamily?: FontFamilyToken,
  textAlign?: TextAlignToken,
}
