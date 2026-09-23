import type { HexColor } from '../utils/hex-color'
import type { TextAlignValue } from '../primitive-tokens/text-align-token'

export type TextStyle = {
  type: 'textStyle',
  color?: HexColor,
  fontSize?: number,
  lineHeight?: number,
  fontWeight?: number,
  fontFamily?: string,
  textAlign?: TextAlignValue,
}
