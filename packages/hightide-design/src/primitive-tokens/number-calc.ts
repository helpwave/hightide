import type { AssertAssignable } from '../utils/assert'
import type { Token, TokenRefOrValue } from '../utils/token-type'
import type { NumberValueToken } from './number-value-token'

export type NumberCalculationOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'min'
  | 'max'
  | 'floor'
  | 'round'
  | 'ceil'

export type NumberCalcToken = AssertAssignable<{
  type: 'numberCalc',
  value: {
    operation: NumberCalculationOperation,
    value1: TokenRefOrValue<NumberValueToken>,
    value2: TokenRefOrValue<NumberValueToken>,
  },
}, Token>
