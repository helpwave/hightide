import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'
import type { AxisAlignmentValue } from './axis-alignment-token'
import type { StretchValue } from './stretch-token'

export type CrossAxisAlignmentValue = AxisAlignmentValue | StretchValue

export type CrossAxisAlignmentToken = AssertAssignable<{
  type: 'crossAxisAlignment',
  value: CrossAxisAlignmentValue,
}, Token>

export const isCrossAxisAlignmentToken = (value: unknown): value is CrossAxisAlignmentToken => (
  typeof value === 'object'
  && value !== null
  && (value as CrossAxisAlignmentToken).type === 'crossAxisAlignment'
)
