import type { AssertAssignable } from '../utils/assert'
import type { Token, TokenRefOrValue } from '../utils/token-type'
import type { ColorOpToken } from './color-op'
import type { ColorToken } from './color-token'

export type ColorValueToken = AssertAssignable<{
  type: 'colorValue',
  value: TokenRefOrValue<ColorToken | ColorOpToken>,
}, Token>
