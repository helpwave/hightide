import type { ComponentSize } from '../theme-tokens/layout'
import type { HightideThemeTokens } from '../theme-tokens/themeTokens'

export type HightideControlElementLayoutToken = {
  size: number,
  inset: number,
  border: number,
  minimumWidth?: number,
  horizontalContentPadding?: number,
}

export type HightideContainerLayoutToken = {
  size?: number,
  insetY: number,
  insetX: number,
  minimumWidth?: number,
  minimumHeight?: number,
}

export type HightideInsideControlElementLayoutToken = {
  size: number,
}

export type HightideInsideControlElementLayoutTokens = Record<
  ComponentSize,
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

const componentSizes: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

export const toHightideElementLayoutFromTheme = (
  themeTokens: HightideThemeTokens
): HightideSemanticElementLayoutTokens => {
  const { size, padding, border, paddingExtension } = themeTokens

  const control = Object.fromEntries(
    componentSizes.map((key) => {
      const inset = padding[key]
      return [key, {
        size: size[key],
        inset,
        border: border.normal,
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
        minimumWidth: controlMinimumWidths[key],
        minimumHeight: size[key],
      } satisfies HightideContainerLayoutToken]
    })
  ) as Record<ComponentSize, HightideContainerLayoutToken>

  const insideControl = Object.fromEntries(
    componentSizes.map((key) => {
      const token = control[key]
      return [key, {
        size: token.size - 2 * token.inset - 2 * token.border,
      } satisfies HightideInsideControlElementLayoutToken]
    })
  ) as HightideInsideControlElementLayoutTokens

  return { control, container, insideControl }
}
