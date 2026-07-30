import type { HightideBorderPrimitiveTokens } from '../primitive-tokens/border'
import type { HightideSizePrimitiveTokens } from '../primitive-tokens/size'

export type ComponentSizeBasic = 'sm' | 'md' | 'lg'
export type ComponentSize = ComponentSizeBasic | 'xs' | 'xl'

export const componentSizes: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

export type HightideThemeSizeTokens = Record<ComponentSize, number>
export type HightideThemePaddingTokens = Record<ComponentSize, number>
export type HightideThemePaddingExtensionTokens = Record<ComponentSize, number>
export type HightideThemeBorderTokens = Record<ComponentSize, number>

export const toHightideThemeSize = (sizes: HightideSizePrimitiveTokens): HightideThemeSizeTokens => ({
  xs: sizes[28],
  sm: sizes[36],
  md: sizes[44],
  lg: sizes[52],
  xl: sizes[60],
})

export const toHightideThemePadding = (): HightideThemePaddingTokens => ({
  xs: 6,
  sm: 6,
  md: 10,
  lg: 10,
  xl: 12,
})

export const toHightideThemePaddingExtension = (sizes: HightideSizePrimitiveTokens): HightideThemePaddingExtensionTokens => ({
  xs: sizes[4],
  sm: sizes[4],
  md: sizes[12],
  lg: sizes[12],
  xl: sizes[12],
})

export const toHightideThemeBorder = (border: HightideBorderPrimitiveTokens): HightideThemeBorderTokens => ({
  xs: border[1],
  sm: border[1],
  md: border[2],
  lg: border[2],
  xl: border[4],
})
