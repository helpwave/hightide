import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'

export type FontWeightKey = 'thin' | 'light' | 'base' | 'medium' | 'semibold' | 'bold'

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type FontWeightToken = AssertAssignable<{
  type: 'fontWeight',
  value: FontWeight,
}, Token>

export const isFontWeightToken = (value: unknown): value is FontWeightToken => (
  typeof value === 'object'
  && value !== null
  && (value as FontWeightToken).type === 'fontWeight'
)
