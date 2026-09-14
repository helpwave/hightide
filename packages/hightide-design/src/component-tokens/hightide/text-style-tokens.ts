import type { ResolvableTextStyleTokens } from '../resolvable-text-style-tokens'
import type { HightideResolverConfig, ResolverState } from '../../primitive-tokens'

export type { TextStyleTokens } from '../text-style-tokens'
export type { ResolvableTextStyleTokens } from '../resolvable-text-style-tokens'

export type TextStyleState = ResolverState
export type TextStyleConfig = HightideResolverConfig

export type TextStyleTokenConfig<
  S extends ResolverState = TextStyleState,
  C extends HightideResolverConfig = TextStyleConfig
> = ResolvableTextStyleTokens<S, C>
