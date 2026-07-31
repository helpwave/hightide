import type { ColorToken } from '../../primitive-tokens/color'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'

export type HightideCardTokens = {
  background: ColorToken,
  text: ColorToken,
  border: ColorToken,
}

export const toCardTokens = (
  semanticTokens: HightideSemanticTokens
): HightideCardTokens => ({
  background: semanticTokens.colors.surfaceVariant,
  text: semanticTokens.colors.onSurface,
  border: semanticTokens.colors.border,
})
