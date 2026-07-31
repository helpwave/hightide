import type { ColorToken } from '../../primitive-tokens/color'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'

export type HightideProgressIndicatorTokens = {
  fill: ColorToken,
  background: ColorToken,
}

export const toProgressIndicatorTokens = (
  semanticTokens: HightideSemanticTokens
): HightideProgressIndicatorTokens => ({
  fill: semanticTokens.colorSchemes.primary.filled.base.color,
  background: semanticTokens.colors.subtle,
})
