import type { ColorToken } from '../../primitive-tokens/color-token'
import type { NumberToken } from '../../primitive-tokens/number-token'
import type { DotPath } from '../../utils/path'
import type { TokenRefPath } from '../../utils/token-type'
import type { PressableButtonTokenParams } from './pressable-button-params'
import type { HightideTokenPathProvider } from './token-context'

export type PressableButtonParameterPath =
  | TokenRefPath<ColorToken, HightideTokenPathProvider<PressableButtonTokenParams>>
  | TokenRefPath<NumberToken, HightideTokenPathProvider<PressableButtonTokenParams>>
  | DotPath<HightideTokenPathProvider<PressableButtonTokenParams>, string>
