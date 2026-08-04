import type { ColorToken } from '../primitive-tokens/color'
import type { ShadowLayoutToken } from '../primitive-tokens/shadow'
import type {
  ThemeBorderWidthKey,
  ThemeElevationLevel,
  ThemeLayoutSize,
  ThemeMotionDurationKey,
  ThemeSpacingSize,
  ThemeTypographySize
} from './theme-tokens-config'
import type { TypographyStyleToken } from './typography-style-token'

export type RoleColorToken = {
  color: ColorToken,
  onColor: ColorToken,
  emphasis: ColorToken,
  tint: ColorToken,
  tintEmphasis: ColorToken,
}

export type ThemeColorTokens = {
  transparent: ColorToken,
  background: ColorToken,
  onBackground: ColorToken,
  disabled: ColorToken,
  onDisabled: ColorToken,
  surface: ColorToken,
  onSurface: ColorToken,
  surfaceHover: ColorToken,
  surfaceVariant: ColorToken,
  subtle: ColorToken,
  faded: ColorToken,
  placeholder: ColorToken,
  description: ColorToken,
  border: ColorToken,
  divider: ColorToken,
  primary: RoleColorToken,
  secondary: RoleColorToken,
  tertiary: RoleColorToken,
  positive: RoleColorToken,
  warning: RoleColorToken,
  negative: RoleColorToken,
  neutral: RoleColorToken,
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

export type ThemeElevationTokens = Record<ThemeElevationLevel, ShadowLayoutToken & { color: ColorToken }>

export type ThemeMotionTokens = {
  durations: Record<ThemeMotionDurationKey, number>,
}

export type ThemeTokens = {
  color: ThemeColorTokens,
  typography: ThemeTypographyTokens,
  size: ThemeSizeTokens,
  spacing: ThemeSpacingTokens,
  shape: ThemeShapeTokens,
  borders: ThemeBordersTokens,
  elevation: ThemeElevationTokens,
  motion: ThemeMotionTokens,
}
