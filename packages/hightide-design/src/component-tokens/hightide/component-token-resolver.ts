import type { HightideThemeTokens } from '../../theme-tokens/hightide'
import type { SemanticTokenResolvers } from '../../semantic-tokens/hightide/types'

export type ComponentTokenResolver<TProps, TResult> = (params: {
  themeTokens: HightideThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
} & TProps) => TResult
