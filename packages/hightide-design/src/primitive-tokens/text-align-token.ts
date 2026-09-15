import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type TextAlignValue = 'left' | 'center' | 'right'

export type TextAlignToken = AssertAssignable<{
  type: 'textAlign',
  value: TextAlignValue,
}, Token>

export const isTextAlignToken = (value: unknown): value is TextAlignToken => (
  typeof value === 'object'
  && value !== null
  && (value as TextAlignToken).type === 'textAlign'
)
