import type {
  ShadowToken,
  ThemeShadowTokens
} from '../theme/shadow'

export type ElevationShadowTokens = {
  raised: ShadowToken,
  container: ShadowToken,
  popover: ShadowToken,
  dialog: ShadowToken,
}

export const toHightideElevationShadow = (
  shadow: ThemeShadowTokens
): ElevationShadowTokens => {
  const color = shadow.colors.base

  return {
    raised: { ...shadow.sizes.xs, color },
    container: { ...shadow.sizes.sm, color },
    popover: { ...shadow.sizes.md, color },
    dialog: { ...shadow.sizes.lg, color },
  }
}
