import type { ColorToken } from '../../primitive-tokens/color-token'
import type { OutlineStyleToken } from '../../primitive-tokens/outline-style-token'
import type { FontFamilyToken } from '../../primitive-tokens/font-family-token'
import type { NumberToken } from '../../primitive-tokens/number-token'
import type {
  FontSizeKey
} from '../../primitive-tokens/font-sizing-token'
import type {
  FontWeightKey
} from '../../primitive-tokens/font-weight-token'
import type { TypographyStyleToken } from './typography-style-token'

export type ThemeMode = 'light' | 'dark'

export type ColorPairToken = {
  color: ColorToken,
  onColor: ColorToken,
}

export type TintConfig = {
  light: NumberToken,
  normal: NumberToken,
  strong: NumberToken,
}

export type ColoringConfig = {
  tonal?: {
    color?: NumberToken,
    onColor?: NumberToken,
  },
  transparent?: {
    color?: NumberToken,
    onColor?: NumberToken,
  },
}

export type TintStrength = keyof TintConfig

export type ThemeLayoutSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ThemeSpacingSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type ThemeBorderRadiusSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type ThemePaddingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ThemeTypographySize = 'sm' | 'md' | 'lg'
export const iconSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export type IconSize = typeof iconSizes[number]
export type ThemeBorderWidthKey = 'thin' | 'normal' | 'thick'
export type ThemeElevationLevel = 'level1' | 'level2' | 'level3' | 'level4' | 'level5'
export type ThemeMotionDurationKey = 'fast' | 'normal' | 'slow'

export type FontSizingToken = {
  fontSize: NumberToken,
  lineHeight: NumberToken,
}

export type OutlineToken = {
  width?: NumberToken,
  offset?: NumberToken,
  color?: ColorToken,
  style?: OutlineStyleToken,
}

export type ShadowToken = {
  x: NumberToken,
  y: NumberToken,
  blur: NumberToken,
  spread: NumberToken,
  color: ColorToken,
}

export type ThemeTokensTypographyConfig = {
  display?: TypographyStyleToken,
  heading?: Partial<Record<ThemeTypographySize, TypographyStyleToken>>,
  body?: Partial<Record<ThemeTypographySize, TypographyStyleToken>>,
  label?: Partial<Record<ThemeTypographySize, TypographyStyleToken>>,
}

export type ThemeTokensConfig = {
  themeMode: ThemeMode,
  color: {
    primary: ColorPairToken,
    secondary?: ColorPairToken,
    tertiary?: ColorPairToken,
    negative?: ColorPairToken,
    warning?: ColorPairToken,
    positive?: ColorPairToken,
    background?: ColorPairToken,
    surface?: ColorPairToken,
    surfaceVariant?: ColorPairToken,
    disabled?: ColorPairToken,
    overlay?: ColorToken,
    tintConfig?: TintConfig,
  },
  fontFamilies?: Partial<Record<'default' | 'accent' | 'mono', FontFamilyToken>>,
  fontWeights?: Partial<Record<FontWeightKey, NumberToken>>,
  fontSizing?: Partial<Record<FontSizeKey, FontSizingToken>>,
  typography?: ThemeTokensTypographyConfig,
  icongraphy?: {
    sizes?: Partial<Record<IconSize, NumberToken>>,
    strokeWidth?: NumberToken,
  },
  size?: Partial<Record<ThemeLayoutSize, NumberToken>>,
  spacing?: Partial<Record<ThemeSpacingSize, NumberToken>>,
  padding?: Partial<Record<ThemePaddingSize, NumberToken>>,
  borderRadius?: Partial<Record<ThemeBorderRadiusSize, NumberToken>>,
  borderWidth?: Partial<Record<ThemeBorderWidthKey, NumberToken>>,
  elevation?: Partial<Record<ThemeElevationLevel, ShadowToken>>,
  motion?: {
    durations?: Partial<Record<ThemeMotionDurationKey, NumberToken>>,
  },
  focusOutline?: OutlineToken,
  config?: {
    coloring?: ColoringConfig,
    appearancePercentages?: Partial<{
      normal: NumberToken,
      subtle: NumberToken,
      faded: NumberToken,
    }>,
  },
}

export type ThemeTokensModeConfig = Omit<ThemeTokensConfig, 'themeMode'>
