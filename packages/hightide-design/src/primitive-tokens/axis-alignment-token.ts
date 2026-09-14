import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type AxisAlignmentValue = 'start' | 'center' | 'end'

export type AxisAlignmentToken = AssertAssignable<{
  type: 'axisAlignment',
  value: AxisAlignmentValue,
}, Token>

export const isAxisAlignmentToken = (value: unknown): value is AxisAlignmentToken => (
  typeof value === 'object'
  && value !== null
  && (value as AxisAlignmentToken).type === 'axisAlignment'
)
