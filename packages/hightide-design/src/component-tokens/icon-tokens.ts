import type { ResolverConfig, ResolverState } from '../primitive-tokens'
import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { TokenRefOrValue } from '../utils/token-type'
import type { ContextBasedProperty } from './context-based'

export type IconTokens<
  State extends ResolverState = ResolverState,
  Config extends ResolverConfig = ResolverConfig
> = {
  type: 'icon',
  size?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, State, Config>,
  strokeWidth?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, State, Config>,
  color?: ContextBasedProperty<TokenRefOrValue<ColorValueToken>, State, Config>,
}
