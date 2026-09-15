import type { ColorValueToken } from '../../primitive-tokens/color-value-token'
import type { OutlineStyleToken } from '../../primitive-tokens/outline-style-token'
import type { FontFamilyToken } from '../../primitive-tokens/font-family-token'
import type { NumberValueToken } from '../../primitive-tokens/number-value-token'
import type {
  FontSizeKey
} from '../../primitive-tokens/font-sizing-token'
import type {
  FontWeightKey
} from '../../primitive-tokens/font-weight-token'
import type { TypographyStyleToken } from './typography-style-token'

export type ThemeMode = 'light' | 'dark'

export type ColorPairToken = {
  color: ColorValueToken,
  onColor: ColorValueToken,
}

export type TintConfig = {
  light: NumberValueToken,
  normal: NumberValueToken,
  strong: NumberValueToken,
}

export type ColoringConfig = {
  tonal?: {
    color?: NumberValueToken,
    onColor?: NumberValueToken,
  },
  transparent?: {
    color?: NumberValueToken,
    onColor?: NumberValueToken,
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
  fontSize: NumberValueToken,
  lineHeight: NumberValueToken,
}

export type OutlineToken = {
  width?: NumberValueToken,
  offset?: NumberValueToken,
  color?: ColorValueToken,
  style?: OutlineStyleToken,
}

export type ShadowToken = {
  x: NumberValueToken,
  y: NumberValueToken,
  blur: NumberValueToken,
  spread: NumberValueToken,
  color: ColorValueToken,
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
    overlay?: ColorValueToken,
    tintConfig?: TintConfig,
  },
  fontFamilies?: Partial<Record<'default' | 'accent' | 'mono', FontFamilyToken>>,
  fontWeights?: Partial<Record<FontWeightKey, NumberValueToken>>,
  fontSizing?: Partial<Record<FontSizeKey, FontSizingToken>>,
  typography?: ThemeTokensTypographyConfig,
  icongraphy?: {
    sizes?: Partial<Record<IconSize, NumberValueToken>>,
    strokeWidth?: NumberValueToken,
  },
  size?: Partial<Record<ThemeLayoutSize, NumberValueToken>>,
  spacing?: Partial<Record<ThemeSpacingSize, NumberValueToken>>,
  padding?: Partial<Record<ThemePaddingSize, NumberValueToken>>,
  borderRadius?: Partial<Record<ThemeBorderRadiusSize, NumberValueToken>>,
  borderWidth?: Partial<Record<ThemeBorderWidthKey, NumberValueToken>>,
  elevation?: Partial<Record<ThemeElevationLevel, ShadowToken>>,
  motion?: {
    durations?: Partial<Record<ThemeMotionDurationKey, NumberValueToken>>,
  },
  focusOutline?: OutlineToken,
  config?: {
    coloring?: ColoringConfig,
    appearancePercentages?: Partial<{
      normal: NumberValueToken,
      subtle: NumberValueToken,
      faded: NumberValueToken,
    }>,
  },
}

export type ThemeTokensModeConfig = Omit<ThemeTokensConfig, 'themeMode'>
