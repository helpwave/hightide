import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { SemanticTokenResolvers } from '../semantic-tokens/types'

export type ComponentTokenResolver<TProps, TResult> = (params: {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
} & TProps) => TResult
