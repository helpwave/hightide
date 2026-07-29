import type { BorderPrimitiveTokens } from '../primitive/border'
import type { SizePrimitiveTokens } from '../primitive/size'

export type ComponentSizeBasic = 'sm' | 'md' | 'lg'
export type ComponentSize = ComponentSizeBasic | 'xs' | 'xl'

export const componentSizes: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

export type ThemeSizeTokens = Record<ComponentSize, number>
export type ThemePaddingTokens = Record<ComponentSize, number>
export type ThemePaddingExtensionTokens = Record<ComponentSize, number>
export type ThemeBorderTokens = Record<ComponentSize, number>

export const toHightideThemeSize = (sizes: SizePrimitiveTokens): ThemeSizeTokens => ({
  xs: sizes[28],
  sm: sizes[36],
  md: sizes[44],
  lg: sizes[52],
  xl: sizes[60],
})

export const toHightideThemePadding = (): ThemePaddingTokens => ({
  xs: 6,
  sm: 6,
  md: 10,
  lg: 10,
  xl: 12,
})

export const toHightideThemePaddingExtension = (sizes: SizePrimitiveTokens): ThemePaddingExtensionTokens => ({
  xs: sizes[4],
  sm: sizes[4],
  md: sizes[12],
  lg: sizes[12],
  xl: sizes[12],
})

export const toHightideThemeBorder = (border: BorderPrimitiveTokens): ThemeBorderTokens => ({
  xs: border[1],
  sm: border[1],
  md: border[2],
  lg: border[2],
  xl: border[4],
})
