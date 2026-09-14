import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'
import type { AxisAlignmentValue } from './axis-alignment-token'
import type { SpacingAlignmentValue } from './spacing-alignment-token'

export type MainAxisAlignmentValue = AxisAlignmentValue | SpacingAlignmentValue

export type MainAxisAlignmentToken = AssertAssignable<{
  type: 'mainAxisAlignment',
  value: MainAxisAlignmentValue,
}, Token>

export const isMainAxisAlignmentToken = (value: unknown): value is MainAxisAlignmentToken => (
  typeof value === 'object'
  && value !== null
  && (value as MainAxisAlignmentToken).type === 'mainAxisAlignment'
)
