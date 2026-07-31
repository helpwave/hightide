export type ComponentSizeBasic = 'sm' | 'md' | 'lg'
export type ComponentSize = ComponentSizeBasic | 'xs' | 'xl'

export const componentSizesBasic: ComponentSizeBasic[] = ['sm', 'md', 'lg']
export const componentSizes: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

export type HightideThemeSizeTokens = Record<ComponentSize, number>
export type HightideThemePaddingTokens = Record<ComponentSize, number>
export type HightideThemePaddingExtensionTokens = Record<ComponentSize, number>
export type HightideThemeSpacingTokens = Record<ComponentSize, number>
export type HightideThemeBorderWidthTokens = {
  thin: number,
  normal: number,
  thick: number,
}
export type HightideThemeBorderRadiusTokens = Record<ComponentSize, number>

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
