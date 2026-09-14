import type { AssertAssignable } from '../utils/assert'
import type { Token, TokenRef } from '../utils/token-type'
import type { ColorValueToken } from './color-value-token'
import type { NumberValueToken } from './number-value-token'

export type ColorOpOperation = 'opacity' | 'lightness' | 'blend'

export type ColorOpToken = AssertAssignable<{
  type: 'colorOp',
  value: {
    operation: 'opacity',
    color: ColorValueToken | TokenRef<ColorValueToken>,
    amount: NumberValueToken | TokenRef<NumberValueToken>,
  } | {
    operation: 'lightness',
    color: ColorValueToken | TokenRef<ColorValueToken>,
    amount: NumberValueToken | TokenRef<NumberValueToken>,
  } | {
    operation: 'blend',
    background: ColorValueToken | TokenRef<ColorValueToken>,
    tint: ColorValueToken | TokenRef<ColorValueToken>,
  },
}, Token>
