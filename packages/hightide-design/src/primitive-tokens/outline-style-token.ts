import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type OutlineStyleValue = 'dotted' | 'dashed' | 'solid'

export type OutlineStyleToken = AssertAssignable<{
  type: 'outlineStyle',
  value: OutlineStyleValue,
}, Token>

export const isOutlineStyleToken = (value: unknown): value is OutlineStyleToken => (
  typeof value === 'object'
  && value !== null
  && (value as OutlineStyleToken).type === 'outlineStyle'
)
