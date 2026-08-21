import type { ColorToken } from '../primitive-tokens/color'
import type { ShadowLayoutToken } from '../primitive-tokens/shadow'
import type {
  FontSizeKey,
  FontSizingToken,
  FontWeightKey,
  FontWeightToken
} from '../primitive-tokens/typography'
import type {
  ColorPairToken,
  IconSize,
  ThemeBorderRadiusSize,
  ThemeBorderWidthKey,
  ThemeElevationLevel,
  ThemeLayoutSize,
  ThemeMotionDurationKey,
  ThemePaddingSize,
  ThemeSpacingSize,
  ThemeTypographySize,
  TintConfig
} from './theme-tokens-config'
import type { TypographyStyleToken } from './typography-style-token'

export type OutlineStyle = 'dotted' | 'dashed' | 'solid'

export type OutlineToken = {
  width?: number,
  offset?: number,
  color?: ColorToken,
  style?: OutlineStyle,
}

export type ThemeColorTokens = {
  tintConfig: TintConfig,
  background: ColorPairToken,
  surface: ColorPairToken,
  surfaceVariant: ColorPairToken,
  surfaceInverse: ColorPairToken,
  disabled: ColorPairToken,
  primary: ColorPairToken,
  secondary: ColorPairToken,
  tertiary: ColorPairToken,
  positive: ColorPairToken,
  warning: ColorPairToken,
  negative: ColorPairToken,
  neutral: ColorPairToken,
  border: ColorToken,
}

export type ThemeAppearancePercentages = {
  normal: number,
  subtle: number,
  faded: number,
}

export type ColoringConfigTokens = {
  tonal: {
    color: number,
    onColor: number,
  },
  transparent: {
    color: number,
    onColor: number,
  },
}

export type ThemeConfigTokens = {
  coloring: ColoringConfigTokens,
  appearancePercentages: ThemeAppearancePercentages,
}

export type { FontSizingToken }

export type ThemeFontFamilyTokens = Record<'default' | 'accent' | 'mono', string>

export type ThemeFontWeightTokens = Record<FontWeightKey, FontWeightToken>

export type ThemeFontSizingTokens = Record<FontSizeKey, FontSizingToken>

export type ThemeTypographyTokens = {
  display: TypographyStyleToken,
  heading: Record<ThemeTypographySize, TypographyStyleToken>,
  body: Record<ThemeTypographySize, TypographyStyleToken>,
  label: Record<ThemeTypographySize, TypographyStyleToken>,
}

export type ThemeIcongraphyTokens = {
  sizes: Record<IconSize, number>,
  strokeWidth: number,
}

export type ThemeSizeTokens = Record<ThemeLayoutSize, number>

export type ThemeSpacingTokens = Record<ThemeSpacingSize, number>

export type ThemePaddingTokens = Record<ThemePaddingSize, number>

export type ThemeBorderRadiusTokens = Record<ThemeBorderRadiusSize, number>

export type ThemeBorderWidthTokens = Record<ThemeBorderWidthKey, number>

export type ShadowToken = ShadowLayoutToken & { color: ColorToken }

export type ThemeElevationTokens = Record<ThemeElevationLevel, ShadowLayoutToken & { color: ColorToken }>

export type ThemeMotionTokens = {
  durations: Record<ThemeMotionDurationKey, number>,
}

export type ThemeTokens = {
  color: ThemeColorTokens,
  fontFamilies: ThemeFontFamilyTokens,
  fontWeights: ThemeFontWeightTokens,
  fontSizing: ThemeFontSizingTokens,
  typography: ThemeTypographyTokens,
  icongraphy: ThemeIcongraphyTokens,
  size: ThemeSizeTokens,
  spacing: ThemeSpacingTokens,
  padding: ThemePaddingTokens,
  borderRadius: ThemeBorderRadiusTokens,
  borderWidth: ThemeBorderWidthTokens,
  elevation: ThemeElevationTokens,
  motion: ThemeMotionTokens,
  focusOutline: OutlineToken,
  config: ThemeConfigTokens,
}
