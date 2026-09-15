import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type SpacingAlignmentValue = 'space-between' | 'space-evenly' | 'space-around'

export type SpacingAlignmentToken = AssertAssignable<{
  type: 'spacingAlignment',
  value: SpacingAlignmentValue,
}, Token>

export const isSpacingAlignmentToken = (value: unknown): value is SpacingAlignmentToken => (
  typeof value === 'object'
  && value !== null
  && (value as SpacingAlignmentToken).type === 'spacingAlignment'
)
