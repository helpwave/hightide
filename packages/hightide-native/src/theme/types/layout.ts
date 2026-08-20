import type {
  ThemeBorderRadiusTokens,
  ThemeBorderWidthTokens,
  ThemeElevationTokens,
  ThemeMotionTokens,
  ThemePaddingTokens,
  ThemeSizeTokens,
  ThemeSpacingTokens
} from '@helpwave/hightide-design/theme-tokens'

export type HightideSize = ThemeSizeTokens

export type HightideSpacing = ThemeSpacingTokens

export type HightidePadding = ThemePaddingTokens

export type HightideBorderRadius = ThemeBorderRadiusTokens

export type HightideBorderWidth = ThemeBorderWidthTokens

export type HightideElevation = ThemeElevationTokens

export type HightideMotion = ThemeMotionTokens

export type HightideShadowToken = ThemeElevationTokens[keyof ThemeElevationTokens]

export type HightideShadow = {
  raised: HightideShadowToken,
  container: HightideShadowToken,
  popover: HightideShadowToken,
  dialog: HightideShadowToken,
}
