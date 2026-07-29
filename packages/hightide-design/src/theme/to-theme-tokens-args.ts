import type { PrimitiveTokens } from '../primitive/primitive-tokens'

export type ToThemeTokensArgs<Tokens extends PrimitiveTokens = PrimitiveTokens> = {
  primitiveTokens: Tokens,
}
