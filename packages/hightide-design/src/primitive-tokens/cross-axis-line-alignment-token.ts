import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'
import type { AxisAlignmentValue } from './axis-alignment-token'
import type { SpacingAlignmentValue } from './spacing-alignment-token'
import type { StretchValue } from './stretch-token'

export type CrossAxisLineAlignmentValue = AxisAlignmentValue | SpacingAlignmentValue | StretchValue

export type CrossAxisLineAlignmentToken = AssertAssignable<{
  type: 'crossAxisLineAlignment',
  value: CrossAxisLineAlignmentValue,
}, Token>

export const isCrossAxisLineAlignmentToken = (value: unknown): value is CrossAxisLineAlignmentToken => (
  typeof value === 'object'
  && value !== null
  && (value as CrossAxisLineAlignmentToken).type === 'crossAxisLineAlignment'
)
