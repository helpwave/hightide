import { hightideBorder } from '../primitive-tokens/border'
import { hightideSizes } from '../primitive-tokens/size'

export type ComponentSizeBasic = 'sm' | 'md' | 'lg'
export type ComponentSize = ComponentSizeBasic | 'xs' | 'xl'

export const componentSizes: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

export type HightideThemeSizeTokens = Record<ComponentSize, number>
export type HightideThemePaddingTokens = Record<ComponentSize, number>
export type HightideThemePaddingExtensionTokens = Record<ComponentSize, number>
export type HightideThemeBorderTokens = Record<ComponentSize, number>

export const hightideThemeSizeTokens: HightideThemeSizeTokens = {
  xs: hightideSizes[28],
  sm: hightideSizes[36],
  md: hightideSizes[44],
  lg: hightideSizes[52],
  xl: hightideSizes[60],
}

export const hightideThemePaddingTokens: HightideThemePaddingTokens = {
  xs: 6,
  sm: 6,
  md: 10,
  lg: 10,
  xl: 12,
}

export const hightideThemePaddingExtensionTokens: HightideThemePaddingExtensionTokens = {
  xs: hightideSizes[4],
  sm: hightideSizes[4],
  md: hightideSizes[12],
  lg: hightideSizes[12],
  xl: hightideSizes[12],
}

export const hightideThemeBorderTokens: HightideThemeBorderTokens = {
  xs: hightideBorder[1],
  sm: hightideBorder[1],
  md: hightideBorder[2],
  lg: hightideBorder[2],
  xl: hightideBorder[4],
}
