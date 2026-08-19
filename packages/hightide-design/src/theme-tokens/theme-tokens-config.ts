import type { HexColorToken } from '../primitive-tokens/color'
import type { ShadowLayoutToken } from '../primitive-tokens/shadow'
import type { OutlineToken } from './theme-tokens'
import type { TypographyStyleToken } from './typography-style-token'

export type ThemeMode = 'light' | 'dark'

export type ColorPairToken = {
  color: HexColorToken,
  onColor: HexColorToken,
}

export type TintConfig = {
  light: number,
  normal: number,
  strong: number,
}

export type ColoringConfig = {
  tonal?: {
    color: number,
    onColor: number,
  },
  transparent?: {
    color: number,
    onColor: number,
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

export type ThemeTokensTypographyConfig = {
  fontFamilies?: {
    default?: string,
    accent?: string,
    mono?: string,
  },
  fontWeights?: {
    thin?: TypographyStyleToken['fontWeight'],
    light?: TypographyStyleToken['fontWeight'],
    base?: TypographyStyleToken['fontWeight'],
    medium?: TypographyStyleToken['fontWeight'],
    semibold?: TypographyStyleToken['fontWeight'],
    bold?: TypographyStyleToken['fontWeight'],
  },
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
    tintConfig?: TintConfig,
  },
  decoration?: {
    appearancePercentages?: {
      normal?: number,
      subtle?: number,
      faded?: number,
    },
  },
  typography?: ThemeTokensTypographyConfig,
  icongraphy?: {
    sizes?: Partial<Record<IconSize, number>>,
    strokeWidth?: number,
  },
  size?: Partial<Record<ThemeLayoutSize, number>>,
  spacing?: Partial<Record<ThemeSpacingSize, number>>,
  shape?: {
    borderRadius?: Partial<Record<ThemeBorderRadiusSize, number>>,
    padding?: Partial<Record<ThemePaddingSize, number>>,
  },
  borderWidth?: Partial<Record<ThemeBorderWidthKey, number>>,
  elevation?: Partial<Record<ThemeElevationLevel, ShadowLayoutToken>>,
  motion?: {
    durations?: Partial<Record<ThemeMotionDurationKey, number>>,
  },
  focusOutline?: OutlineToken,
  coloring?: ColoringConfig,
}

export type ThemeTokensModeConfig = Omit<ThemeTokensConfig, 'themeMode'>
