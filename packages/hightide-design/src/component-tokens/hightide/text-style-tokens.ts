import type { TextTokens } from '../text-tokens'
import type { HightideResolverConfig } from '../../primitive-tokens'

export type { TextTokens } from '../text-tokens'

export type TextStyleConfig = HightideResolverConfig

export type TextStyleTokenConfig<
  C extends HightideResolverConfig = TextStyleConfig
> = TextTokens
