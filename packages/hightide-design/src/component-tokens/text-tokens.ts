import type { ResolverConfig } from '../primitive-tokens'
import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { FontFamilyToken } from '../primitive-tokens/font-family-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { TextAlignToken } from '../primitive-tokens/text-align-token'
import type { TokenRefOrValue } from '../utils/token-type'
import type { ContextBasedProperty } from './context-based'

export type TextTokens<
  Config extends ResolverConfig = ResolverConfig
> = {
  type: 'textStyle',
  color?: ContextBasedProperty<TokenRefOrValue<ColorValueToken>, Config>,
  fontSize?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, Config>,
  lineHeight?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, Config>,
  fontWeight?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, Config>,
  fontFamily?: ContextBasedProperty<TokenRefOrValue<FontFamilyToken>, Config>,
  textAlign?: ContextBasedProperty<TokenRefOrValue<TextAlignToken>, Config>,
}
