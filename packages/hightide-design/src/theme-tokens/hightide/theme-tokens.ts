import type { ColorToken } from '../../primitive-tokens/color-token'
import type { NumberToken } from '../../primitive-tokens/number-token'
import type { AssertAssignable } from '../../utils/assert'
import type {
  FontSizeKey
} from '../../primitive-tokens/font-sizing-token'
import type {
  FontWeightKey
} from '../../primitive-tokens/font-weight-token'
import type {
  ColorPairToken,
  FontSizingToken,
  IconSize,
  OutlineToken,
  ShadowToken,
  ThemeBorderRadiusSize,
  ThemeBorderWidthKey,
  ThemeElevationLevel,
  ThemeLayoutSize,
  ThemeMotionDurationKey,
  ThemePaddingSize,
  ThemeSpacingSize,
  ThemeTypographySize,
  TintConfig
} from '../create/theme-tokens-config'
import type { TypographyStyleToken } from '../create/typography-style-token'
import type { ThemeTokens } from '../create/theme-tokens'
import type { FontFamilyToken } from '../../primitive-tokens/font-family-token'

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
  overlay: ColorToken,
}

export type ThemeAppearancePercentages = {
  normal: NumberToken,
  subtle: NumberToken,
  faded: NumberToken,
}

export type ColoringConfigTokens = {
  tonal: {
    color: NumberToken,
    onColor: NumberToken,
  },
  transparent: {
    color: NumberToken,
    onColor: NumberToken,
  },
}

export type ThemeConfigTokens = {
  coloring: ColoringConfigTokens,
  appearancePercentages: ThemeAppearancePercentages,
}

export type ThemeFontFamilyTokens = Record<'default' | 'accent' | 'mono', FontFamilyToken>

export type ThemeFontWeightTokens = Record<FontWeightKey, NumberToken>

export type ThemeFontSizingTokens = Record<FontSizeKey, FontSizingToken>

export type ThemeTypographyTokens = {
  display: TypographyStyleToken,
  heading: Record<ThemeTypographySize, TypographyStyleToken>,
  body: Record<ThemeTypographySize, TypographyStyleToken>,
  label: Record<ThemeTypographySize, TypographyStyleToken>,
}

export type ThemeIcongraphyTokens = {
  sizes: Record<IconSize, NumberToken>,
  strokeWidth: NumberToken,
}

export type ThemeSizeTokens = Record<ThemeLayoutSize, NumberToken>

export type ThemeSpacingTokens = Record<ThemeSpacingSize, NumberToken>

export type ThemePaddingTokens = Record<ThemePaddingSize, NumberToken>

export type ThemeBorderRadiusTokens = Record<ThemeBorderRadiusSize, NumberToken>

export type ThemeBorderWidthTokens = Record<ThemeBorderWidthKey, NumberToken>

export type ThemeElevationTokens = Record<ThemeElevationLevel, ShadowToken>

export type ThemeMotionTokens = {
  durations: Record<ThemeMotionDurationKey, NumberToken>,
}

export type HightideThemeTokens = AssertAssignable<{
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
}, ThemeTokens>
