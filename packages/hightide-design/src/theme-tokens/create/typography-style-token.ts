import type { NumberValueToken } from '../../primitive-tokens/number-value-token'
import type { FontFamilyToken } from '../../primitive-tokens/font-family-token'

export type TypographyStyleToken = {
  fontSize: NumberValueToken,
  lineHeight: NumberValueToken,
  fontWeight: NumberValueToken,
  fontFamily: FontFamilyToken,
}
