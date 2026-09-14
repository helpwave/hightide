import type { NumberToken } from '../../primitive-tokens/number-token'
import type { FontFamilyToken } from '../../primitive-tokens/font-family-token'

export type TypographyStyleToken = {
  fontSize: NumberToken,
  lineHeight: NumberToken,
  fontWeight: NumberToken,
  fontFamily: FontFamilyToken,
}
