import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type FlexWrapValue = 'nowrap' | 'wrap' | 'wrap-reverse'

export type FlexWrapToken = AssertAssignable<{
  type: 'flexWrap',
  value: FlexWrapValue,
}, Token>

export const isFlexWrapToken = (value: unknown): value is FlexWrapToken => (
  typeof value === 'object'
  && value !== null
  && (value as FlexWrapToken).type === 'flexWrap'
)
