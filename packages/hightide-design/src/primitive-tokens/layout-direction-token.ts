import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type LayoutDirectionValue = 'horizontal' | 'vertical'

export type LayoutDirectionToken = AssertAssignable<{
  type: 'layoutDirection',
  value: LayoutDirectionValue,
}, Token>

export const isLayoutDirectionToken = (value: unknown): value is LayoutDirectionToken => (
  typeof value === 'object'
  && value !== null
  && (value as LayoutDirectionToken).type === 'layoutDirection'
)
