import type { ColorToken } from '../../primitive-tokens/color'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'

export type HightideMenuTokens = {
  background: ColorToken,
  text: ColorToken,
  border: ColorToken,
}

export const toMenuTokens = (
  semanticTokens: HightideSemanticTokens
): HightideMenuTokens => ({
  background: semanticTokens.colors.surfaceVariant,
  text: semanticTokens.colors.onSurface,
  border: semanticTokens.colors.border,
})
