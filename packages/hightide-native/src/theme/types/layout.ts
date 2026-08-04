import type {
  ElementLayoutTokens,
  ThemeBordersTokens,
  ThemeElevationTokens,
  ThemeShapeTokens,
  ThemeSpacingTokens
} from '@helpwave/hightide-design/theme-tokens'

export type HightideSpacing = ThemeSpacingTokens

export type HightideElements = ElementLayoutTokens

export type HightideBorderRadius = ThemeShapeTokens['borderRadius']

export type HightideBorder = ThemeBordersTokens['borderWidths']

export type HightideShadowToken = ThemeElevationTokens[keyof ThemeElevationTokens]

export type HightideShadow = {
  raised: HightideShadowToken,
  container: HightideShadowToken,
  popover: HightideShadowToken,
  dialog: HightideShadowToken,
}
