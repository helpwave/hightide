import type { TextTokens } from '../text-tokens'
import type { HightideResolverConfig, ResolverState } from '../../primitive-tokens'

export type { TextTokens } from '../text-tokens'

export type TextStyleState = ResolverState
export type TextStyleConfig = HightideResolverConfig

export type TextStyleTokenConfig<
  S extends ResolverState = TextStyleState,
  C extends HightideResolverConfig = TextStyleConfig
> = TextTokens
