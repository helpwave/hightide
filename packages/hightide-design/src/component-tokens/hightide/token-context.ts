import type { HightideThemeTokens } from '../../theme-tokens/hightide'
import type { HightideResolverParams, HightideResolverConfig, ResolverState } from '../../primitive-tokens/resolver-types'
import type { HightideSemanticTokens, SemanticTokens } from '../../semantic-tokens'

export type HightideTokenPathProvider<T extends HightideResolverParams = HightideResolverParams> = {
  theme: HightideThemeTokens,
  semantics: HightideSemanticTokens,
  params: T,
}

export type HightideComponentPathProvider = {
  theme: HightideThemeTokens,
  semantics: SemanticTokens<{ theme: HightideThemeTokens }, ResolverState, HightideResolverConfig>,
  params: HightideResolverParams,
}
