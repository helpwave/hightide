import type { ColorToken } from '../primitive-tokens/color'
import type { FontWeightToken } from '../primitive-tokens/typography'
import type { ComponentTokenConfig } from './token-config'
import type { TokenContext } from './token-context'

export type TextAlignToken = 'left' | 'center' | 'right'

export type TextStyleTokens = {
  color?: ColorToken,
  fontSize?: number,
  lineHeight?: number,
  fontWeight?: FontWeightToken,
  fontFamily?: string,
  textAlign?: TextAlignToken,
}

export type TextStyleTokenConfig<
  S extends string = string,
  C extends Record<string, string> = Record<string, string>
> = ComponentTokenConfig<TextStyleTokens, TokenContext<unknown>, S, C>
