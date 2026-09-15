import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { ResolverConfig, ResolverState } from '../primitive-tokens/resolver-types'
import type { ContextBasedProperty } from '../component-tokens/context-based'
import type { TokenRefOrValue } from '../utils/token-type'

export type SemanticTokensNode<
  Value,
  State extends ResolverState = ResolverState,
  Config extends ResolverConfig = ResolverConfig
> =
  | ContextBasedProperty<Value, State, Config>
  | { readonly [key: string]: SemanticTokensNode<Value, State, Config> }

export type SemanticTokens<
  State extends ResolverState = ResolverState,
  Config extends ResolverConfig = ResolverConfig
> = {
  color: Record<string, SemanticTokensNode<TokenRefOrValue<ColorValueToken>, State, Config>>,
  number: Record<string, SemanticTokensNode<TokenRefOrValue<NumberValueToken>, State, Config>>,
}
