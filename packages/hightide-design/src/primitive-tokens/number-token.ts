import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type NumberToken = AssertAssignable<{
  type: 'number',
  value: number,
}, Token>

export const numberValue = (token: NumberToken): number => token.value

export const isNumberToken = (value: unknown): value is NumberToken => (
  typeof value === 'object'
  && value !== null
  && (value as NumberToken).type === 'number'
  && typeof (value as NumberToken).value === 'number'
)
