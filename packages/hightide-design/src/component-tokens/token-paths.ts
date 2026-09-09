import type { ColorToken } from '../primitive-tokens/color'
import type { DotPath } from '../utils/path'
import type { PressableButtonTokenParams } from './pressable-button-params'
import type { TokenContext } from './token-context'

export type PressableButtonParameterPath =
  | DotPath<TokenContext<PressableButtonTokenParams>, ColorToken>
  | DotPath<TokenContext<PressableButtonTokenParams>, number>
  | DotPath<TokenContext<PressableButtonTokenParams>, string>
