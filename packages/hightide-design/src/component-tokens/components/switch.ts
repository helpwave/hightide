import type { ColorToken } from '../../primitive-tokens/color'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'

export type HightideSwitchTokens = {
  track: {
    inactive: ColorToken,
    active: ColorToken,
  },
  thumb: {
    inactive: ColorToken,
    active: ColorToken,
  },
  borderColor: ColorToken,
}

export const toSwitchTokens = (
  semanticTokens: HightideSemanticTokens
): HightideSwitchTokens => ({
  track: {
    inactive: semanticTokens.colors.surfaceVariant,
    active: semanticTokens.colorSchemes.primary.filled.base.background,
  },
  thumb: {
    inactive: semanticTokens.colors.subtle,
    active: semanticTokens.colorSchemes.primary.filled.base.foreground,
  },
  borderColor: semanticTokens.colors.border,
})
