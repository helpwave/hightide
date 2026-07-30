import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'

export type HightideAvatarGroupTokens = {
  overlap: number,
  maxShown: number,
  gap: number,
}

export const toAvatarGroupTokens = (
  semanticTokens: HightideSemanticTokens
): HightideAvatarGroupTokens => ({
  overlap: 0.5,
  maxShown: 5,
  gap: semanticTokens.spacing.sm,
})
