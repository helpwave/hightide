import type { HexColor } from '../utils/hex-color'
import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type ColorToken = AssertAssignable<{
  type: 'color',
  value: HexColor,
}, Token>

export const colorValue = (token: ColorToken): HexColor => token.value

export const isColorToken = (value: unknown): value is ColorToken => (
  typeof value === 'object'
  && value !== null
  && (value as ColorToken).type === 'color'
  && typeof (value as ColorToken).value === 'string'
  && (value as ColorToken).value.startsWith('#')
)
