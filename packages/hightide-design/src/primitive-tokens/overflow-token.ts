import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type OverflowValue = 'visible' | 'hidden' | 'scroll'

export type OverflowToken = AssertAssignable<{
  type: 'overflow',
  value: OverflowValue,
}, Token>

export const isOverflowToken = (value: unknown): value is OverflowToken => (
  typeof value === 'object'
  && value !== null
  && (value as OverflowToken).type === 'overflow'
)
