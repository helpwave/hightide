import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { ResolverConfig } from '../primitive-tokens/resolver-types'
import type { ContextBasedProperty } from '../component-tokens/context-based'
import type { TokenRefOrValue } from '../utils/token-type'

export type SemanticTokensNode<
  Value,
  Config extends ResolverConfig = ResolverConfig
> =
  | ContextBasedProperty<Value, Config>
  | { readonly [key: string]: SemanticTokensNode<Value, Config> }

export type SemanticTokens<
  Config extends ResolverConfig = ResolverConfig
> = {
  color: Record<string, SemanticTokensNode<TokenRefOrValue<ColorValueToken>, Config>>,
  number: Record<string, SemanticTokensNode<TokenRefOrValue<NumberValueToken>, Config>>,
}
