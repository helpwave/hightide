import type { AssertAssignable } from '../utils/assert'
import type { Token, TokenRefOrValue } from '../utils/token-type'
import type { NumberValueToken } from './number-value-token'

export type NumberBinaryCalculationOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'min'
  | 'max'

export type NumberUnaryCalculationOperation =
  | 'floor'
  | 'round'
  | 'ceil'

export type NumberCalculationOperation =
  | NumberBinaryCalculationOperation
  | NumberUnaryCalculationOperation

export type NumberCalcToken = AssertAssignable<{
  type: 'numberCalc',
  value:
    | {
        operation: NumberBinaryCalculationOperation,
        value1: TokenRefOrValue<NumberValueToken>,
        value2: TokenRefOrValue<NumberValueToken>,
      }
    | {
        operation: NumberUnaryCalculationOperation,
        value: TokenRefOrValue<NumberValueToken>,
      },
}, Token>
