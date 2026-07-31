import type { ComponentSize, ComponentSizeBasic } from '../theme-tokens/layout'
import type { HightideThemeTokens } from '../theme-tokens/themeTokens'

export type HightideControlElementLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  minimumWidth?: number,
  horizontalContentPadding?: number,
}

export type HightideContainerLayoutToken = {
  size?: number,
  insetY: number,
  insetX: number,
  borderRadius: number,
  minimumWidth?: number,
  minimumHeight?: number,
}

export type HightideInsideControlElementLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  paddingExtension: number,
}

export type HightideInsideControlElementLayoutTokens = Record<
  ComponentSizeBasic,
  HightideInsideControlElementLayoutToken
>

export type HightideSemanticElementLayoutTokens = {
  control: Record<ComponentSize, HightideControlElementLayoutToken>,
  container: Record<ComponentSize, HightideContainerLayoutToken>,
  insideControl: HightideInsideControlElementLayoutTokens,
}

const controlMinimumWidths: Record<ComponentSize, number> = {
  xs: 80,
  sm: 112,
  md: 144,
  lg: 180,
  xl: 200,
}

const componentSizesReduced: ComponentSizeBasic[] = ['sm', 'md', 'lg']
const componentSizes: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

export const toHightideElementLayoutFromTheme = (
  themeTokens: HightideThemeTokens
): HightideSemanticElementLayoutTokens => {
  const { size, padding, borderWidth: borderWidthTokens, borderRadius, paddingExtension } = themeTokens

  const control = Object.fromEntries(
    componentSizes.map((key) => {
      const inset = padding[key]
      return [key, {
        size: size[key],
        inset,
        borderWidth: borderWidthTokens.normal,
        borderRadius: borderRadius[key],
        minimumWidth: controlMinimumWidths[key],
        horizontalContentPadding: inset + paddingExtension[key],
      } satisfies HightideControlElementLayoutToken]
    })
  ) as Record<ComponentSize, HightideControlElementLayoutToken>

  const container = Object.fromEntries(
    componentSizes.map((key) => {
      const inset = padding[key]
      return [key, {
        size: size[key],
        insetY: inset,
        insetX: inset + paddingExtension[key],
        borderRadius: borderRadius[key],
        minimumWidth: controlMinimumWidths[key],
        minimumHeight: size[key],
      } satisfies HightideContainerLayoutToken]
    })
  ) as Record<ComponentSize, HightideContainerLayoutToken>

  const insideControl = Object.fromEntries(
    componentSizesReduced.map((key) => {
      const smallerKeyMapping: Record<ComponentSizeBasic, ComponentSize> = { sm: 'xs', md: 'sm', lg: 'md' }
      const smallerKey = smallerKeyMapping[key]
      const token = control[key]
      return [key, {
        size: token.size - 2 * token.inset - 2 * token.borderWidth,
        inset: padding[smallerKey],
        borderWidth: borderWidthTokens.thin,
        borderRadius: borderRadius[smallerKey],
        paddingExtension: paddingExtension[smallerKey],
      } satisfies HightideInsideControlElementLayoutToken]
    })
  ) as HightideInsideControlElementLayoutTokens

  return { control, container, insideControl }
}
