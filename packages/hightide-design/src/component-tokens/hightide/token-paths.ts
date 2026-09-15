import type { ColorValueToken } from '../../primitive-tokens/color-value-token'
import type { NumberValueToken } from '../../primitive-tokens/number-value-token'
import type { DotPath } from '../../utils/path'
import type { TokenRefPath } from '../../utils/token-type'
import type { PressableButtonTokenParams } from './pressable-button-params'
import type { HightideTokenPathProvider } from './token-context'

export type PressableButtonParameterPath =
  | TokenRefPath<ColorValueToken, HightideTokenPathProvider<PressableButtonTokenParams>>
  | TokenRefPath<NumberValueToken, HightideTokenPathProvider<PressableButtonTokenParams>>
  | DotPath<HightideTokenPathProvider<PressableButtonTokenParams>, string>
