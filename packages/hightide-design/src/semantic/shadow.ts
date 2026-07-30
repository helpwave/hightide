import type {
  ShadowToken,
  HightideThemeShadowTokens
} from '../theme/shadow'

export type HightideElevationShadowTokens = {
  raised: ShadowToken,
  container: ShadowToken,
  popover: ShadowToken,
  dialog: ShadowToken,
}

export const toHightideElevationShadow = (
  shadow: HightideThemeShadowTokens
): HightideElevationShadowTokens => {
  const color = shadow.colors.base

  return {
    raised: { ...shadow.sizes.xs, color },
    container: { ...shadow.sizes.sm, color },
    popover: { ...shadow.sizes.md, color },
    dialog: { ...shadow.sizes.lg, color },
  }
}
