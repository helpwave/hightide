import type { AssertAssignable } from '../utils/assert'
import type { Token, TokenRef } from '../utils/token-type'
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
    value1: NumberValueToken | TokenRef<NumberValueToken>,
    value2: NumberValueToken | TokenRef<NumberValueToken>,
  },
}, Token>
