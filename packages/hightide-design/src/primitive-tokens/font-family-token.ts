import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type FontFamilyToken = AssertAssignable<{
  type: 'fontFamily',
  value: string,
}, Token>

export const fontFamilyValue = (token: FontFamilyToken): string => token.value

export const isFontFamilyToken = (value: unknown): value is FontFamilyToken => (
  typeof value === 'object'
  && value !== null
  && (value as FontFamilyToken).type === 'fontFamily'
  && typeof (value as FontFamilyToken).value === 'string'
)
