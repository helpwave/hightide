import type {
  ShadowToken,
  HightideThemeShadowTokens
} from '../theme-tokens/shadow'

export type HightideSemanticElevationShadowTokens = {
  raised: ShadowToken,
  container: ShadowToken,
  popover: ShadowToken,
  dialog: ShadowToken,
}

export const toHightideElevationShadow = (
  shadow: HightideThemeShadowTokens
): HightideSemanticElevationShadowTokens => {
  const color = shadow.colors.base

  return {
    raised: { ...shadow.sizes.xs, color },
    container: { ...shadow.sizes.sm, color },
    popover: { ...shadow.sizes.md, color },
    dialog: { ...shadow.sizes.lg, color },
  }
}
