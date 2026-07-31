import type { HightideThemeTokens } from '../theme-tokens'
import type { ShadowToken } from '../theme-tokens/shadow'

export type HightideSemanticShadowTokens = {
  raised: ShadowToken,
  container: ShadowToken,
  popover: ShadowToken,
  dialog: ShadowToken,
}

export const toSemanticShadowTokens = (
  themeTokens: HightideThemeTokens
): HightideSemanticShadowTokens => {
  const { shadow } = themeTokens
  const color = shadow.colors.base

  return {
    raised: { ...shadow.sizes.xs, color },
    container: { ...shadow.sizes.sm, color },
    popover: { ...shadow.sizes.md, color },
    dialog: { ...shadow.sizes.lg, color },
  }
}
