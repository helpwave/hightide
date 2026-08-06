import type { ColorToken } from '../primitive-tokens/color'
import type { ShadowLayoutToken } from '../primitive-tokens/shadow'
import type {
  ColorPairToken,
  ThemeBorderWidthKey,
  ThemeElevationLevel,
  ThemeLayoutSize,
  ThemeMotionDurationKey,
  ThemeSpacingSize,
  ThemeTypographySize,
  TintConfig
} from './theme-tokens-config'
import type { TypographyStyleToken } from './typography-style-token'

export type ThemeColorTokens = {
  tintConfig: TintConfig,
  background: ColorPairToken,
  surface: ColorPairToken,
  surfaceVariant: ColorPairToken,
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

export type ThemeDecorationTokens = {
  appearancePercentages: ThemeAppearancePercentages,
}

export type ThemeTypographyTokens = {
  fontFamilies: {
    default: string,
    accent: string,
    mono: string,
  },
  fontWeights: {
    thin: TypographyStyleToken['fontWeight'],
    light: TypographyStyleToken['fontWeight'],
    base: TypographyStyleToken['fontWeight'],
    medium: TypographyStyleToken['fontWeight'],
    semibold: TypographyStyleToken['fontWeight'],
    bold: TypographyStyleToken['fontWeight'],
  },
  display: TypographyStyleToken,
  heading: Record<ThemeTypographySize, TypographyStyleToken>,
  body: Record<ThemeTypographySize, TypographyStyleToken>,
  label: Record<ThemeTypographySize, TypographyStyleToken>,
}

export type ThemeSizeTokens = Record<ThemeLayoutSize, number>

export type ThemeSpacingTokens = Record<ThemeSpacingSize, number>

export type ThemeShapeTokens = {
  borderRadius: Record<ThemeLayoutSize, number>,
  padding: Record<ThemeSpacingSize, number>,
}

export type ThemeBordersTokens = {
  borderWidths: Record<ThemeBorderWidthKey, number>,
}

export type ShadowToken = ShadowLayoutToken & { color: ColorToken }

export type ThemeElevationTokens = Record<ThemeElevationLevel, ShadowLayoutToken & { color: ColorToken }>

export type ThemeMotionTokens = {
  durations: Record<ThemeMotionDurationKey, number>,
}

export type ThemeTokens = {
  color: ThemeColorTokens,
  decoration: ThemeDecorationTokens,
  typography: ThemeTypographyTokens,
  size: ThemeSizeTokens,
  spacing: ThemeSpacingTokens,
  shape: ThemeShapeTokens,
  borders: ThemeBordersTokens,
  elevation: ThemeElevationTokens,
  motion: ThemeMotionTokens,
}
