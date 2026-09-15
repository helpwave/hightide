import type { ThemeTokens } from '../theme-tokens/create'

export type SemanticTokenResolver<
  TProps,
  TResult,
  Theme extends ThemeTokens = ThemeTokens
> = (params: {
  themeTokens: Theme,
} & TProps) => TResult
