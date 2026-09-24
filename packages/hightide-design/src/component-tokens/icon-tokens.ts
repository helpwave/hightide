import type { ResolverConfig } from '../primitive-tokens'
import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { TokenRefOrValue } from '../utils/token-type'
import type { ContextBasedProperty } from './context-based'

export type IconTokens<
  Config extends ResolverConfig = ResolverConfig
> = {
  type: 'icon',
  size?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, Config>,
  strokeWidth?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, Config>,
  color?: ContextBasedProperty<TokenRefOrValue<ColorValueToken>, Config>,
}
