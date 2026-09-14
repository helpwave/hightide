import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type StretchValue = 'stretch'

export type StretchToken = AssertAssignable<{
  type: 'stretch',
  value: StretchValue,
}, Token>

export const isStretchToken = (value: unknown): value is StretchToken => (
  typeof value === 'object'
  && value !== null
  && (value as StretchToken).type === 'stretch'
)
