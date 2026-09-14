import type { ResolverConfig, ResolverState } from '../primitive-tokens'
import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { FontFamilyToken } from '../primitive-tokens/font-family-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { TextAlignToken } from '../primitive-tokens/text-align-token'
import type { TokenRefOrValue } from '../utils/token-type'
import type { ContextBasedProperty } from './context-based'

export type ResolvableTextStyleTokens<
  State extends ResolverState = ResolverState,
  Config extends ResolverConfig = ResolverConfig
> = {
  type: 'textStyle',
  color?: ContextBasedProperty<TokenRefOrValue<ColorValueToken>, State, Config>,
  fontSize?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, State, Config>,
  lineHeight?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, State, Config>,
  fontWeight?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, State, Config>,
  fontFamily?: ContextBasedProperty<TokenRefOrValue<FontFamilyToken>, State, Config>,
  textAlign?: ContextBasedProperty<TokenRefOrValue<TextAlignToken>, State, Config>,
}
