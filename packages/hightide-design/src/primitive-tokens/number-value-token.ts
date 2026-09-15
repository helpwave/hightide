import type { AssertAssignable } from '../utils/assert'
import type { Token } from '../utils/token-type'
import type { NumberCalcToken } from './number-calc'
import type { NumberToken } from './number-token'

export type NumberValueToken = AssertAssignable<{
  type: 'numberValue',
  value: NumberToken | NumberCalcToken,
}, Token>
