import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type BorderStyleValue = 'dotted' | 'dashed' | 'solid'

export type BorderStyleToken = AssertAssignable<{
  type: 'borderStyle',
  value: BorderStyleValue,
}, Token>

export const isBorderStyleToken = (value: unknown): value is BorderStyleToken => (
  typeof value === 'object'
  && value !== null
  && (value as BorderStyleToken).type === 'borderStyle'
)
