export const themeLayoutSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export type ThemeLayoutSizes = typeof themeLayoutSizes[number]

export type HightideThemeSizeTokens = Record<ThemeLayoutSizes, number>
export type HightideThemePaddingTokens = Record<ThemeLayoutSizes, number>
export type HightideThemePaddingExtensionTokens = Record<ThemeLayoutSizes, number>
export type HightideThemeSpacingTokens = Record<ThemeLayoutSizes, number>
export type HightideThemeBorderWidthTokens = {
  thin: number,
  normal: number,
  thick: number,
}
export type HightideThemeBorderRadiusTokens = Record<ThemeLayoutSizes, number>

export const hightideThemeSizeTokens: HightideThemeSizeTokens = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 52,
  xl: 60,
}

export const hightideThemePaddingTokens: HightideThemePaddingTokens = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
}

export const hightideThemePaddingExtensionTokens: HightideThemePaddingExtensionTokens = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
}

export const hightideThemeSpacingTokens: HightideThemeSpacingTokens = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
}

export const hightideThemeBorderWidthTokens: HightideThemeBorderWidthTokens = {
  thin: 1,
  normal: 2,
  thick: 4,
}

export const hightideThemeBorderRadiusTokens: HightideThemeBorderRadiusTokens = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
}
