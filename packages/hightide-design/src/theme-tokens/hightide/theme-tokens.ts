import type { ColorValueToken } from '../../primitive-tokens/color-value-token'
import type { NumberValueToken } from '../../primitive-tokens/number-value-token'
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
  border: ColorValueToken,
  overlay: ColorValueToken,
}

export type ThemeAppearancePercentages = {
  normal: NumberValueToken,
  subtle: NumberValueToken,
  faded: NumberValueToken,
}

export type ColoringConfigTokens = {
  tonal: {
    color: NumberValueToken,
    onColor: NumberValueToken,
  },
  transparent: {
    color: NumberValueToken,
    onColor: NumberValueToken,
  },
}

export type ThemeConfigTokens = {
  coloring: ColoringConfigTokens,
  appearancePercentages: ThemeAppearancePercentages,
}

export type ThemeFontFamilyTokens = Record<'default' | 'accent' | 'mono', FontFamilyToken>

export type ThemeFontWeightTokens = Record<FontWeightKey, NumberValueToken>

export type ThemeFontSizingTokens = Record<FontSizeKey, FontSizingToken>

export type ThemeTypographyTokens = {
  display: TypographyStyleToken,
  heading: Record<ThemeTypographySize, TypographyStyleToken>,
  body: Record<ThemeTypographySize, TypographyStyleToken>,
  label: Record<ThemeTypographySize, TypographyStyleToken>,
}

export type ThemeIcongraphyTokens = {
  sizes: Record<IconSize, NumberValueToken>,
  strokeWidth: NumberValueToken,
}

export type ThemeSizeTokens = Record<ThemeLayoutSize, NumberValueToken>

export type ThemeSpacingTokens = Record<ThemeSpacingSize, NumberValueToken>

export type ThemePaddingTokens = Record<ThemePaddingSize, NumberValueToken>

export type ThemeBorderRadiusTokens = Record<ThemeBorderRadiusSize, NumberValueToken>

export type ThemeBorderWidthTokens = Record<ThemeBorderWidthKey, NumberValueToken>

export type ThemeElevationTokens = Record<ThemeElevationLevel, ShadowToken>

export type ThemeMotionTokens = {
  durations: Record<ThemeMotionDurationKey, NumberValueToken>,
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
