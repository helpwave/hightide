import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { SemanticTokens } from '../semantic-tokens/types'
import type { DotPath } from '../utils/path'

export type TokenContext<T> = {
  theme: ThemeTokens,
  semantics: SemanticTokens,
  params: T,
}

export type TokenPathOf<Params> =
  | DotPath<TokenContext<Params>, ColorToken>
  | DotPath<TokenContext<Params>, number>
  | DotPath<TokenContext<Params>, string>

export type TokenVariablePath = TokenPathOf<unknown>
