import type { PrimitiveToken } from '../../primitive-tokens'

export type ThemeTokensNode =
  | PrimitiveToken
  | { readonly [key: string]: ThemeTokensNode }

export type ThemeTokens = {
  readonly [key: string]: ThemeTokensNode,
}
