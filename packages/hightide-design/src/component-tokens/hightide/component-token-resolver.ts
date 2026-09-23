import type { ThemeTokens } from '../../theme-tokens/create'
import type { SemanticTokenResolvers } from '../../semantic-tokens/hightide/types'
import type { Resolved } from '../../resolver/resolved'

export type ComponentTokenResolver<TProps, TResult> = (params: {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
} & TProps) => Resolved<TResult>
