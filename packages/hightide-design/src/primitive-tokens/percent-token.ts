import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type PercentToken = AssertAssignable<{
  type: 'percent',
  value: `${number}%`,
}, Token>

export const isPercentToken = (value: unknown): value is PercentToken => (
  typeof value === 'object'
  && value !== null
  && (value as PercentToken).type === 'percent'
)
