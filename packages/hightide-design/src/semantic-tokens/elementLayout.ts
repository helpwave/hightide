import type { ThemeLayoutSizes } from '../theme-tokens/layout'
import type { HightideThemeTokens } from '../theme-tokens/themeTokens'

export const semanticElmentSizes = ['sm', 'md', 'lg'] as const
export type SemanticElmentSize = typeof semanticElmentSizes[number]
export const semanticElmentSizesExtended = ['xs', 'sm', 'md', 'lg', 'lg'] as const
export type SemanticElmentSizeExtended = typeof semanticElmentSizesExtended[number]

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
  SemanticElmentSize,
  HightideInsideControlElementLayoutToken
>

export type HightideSemanticElementLayoutTokens = {
  control: Record<ThemeLayoutSizes, HightideControlElementLayoutToken>,
  container: Record<ThemeLayoutSizes, HightideContainerLayoutToken>,
  insideControl: HightideInsideControlElementLayoutTokens,
}

const controlMinimumWidths: Record<ThemeLayoutSizes, number> = {
  xs: 80,
  sm: 112,
  md: 144,
  lg: 180,
  xl: 200,
}

export const toHightideElementLayoutFromTheme = (
  themeTokens: HightideThemeTokens
): HightideSemanticElementLayoutTokens => {
  const { size, padding, borderWidth: borderWidthTokens, borderRadius, paddingExtension } = themeTokens

  const control = Object.fromEntries(
    semanticElmentSizesExtended.map((key) => {
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
  ) as Record<ThemeLayoutSizes, HightideControlElementLayoutToken>

  const container = Object.fromEntries(
    semanticElmentSizesExtended.map((key) => {
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
  ) as Record<ThemeLayoutSizes, HightideContainerLayoutToken>

  const insideControl = Object.fromEntries(
    semanticElmentSizes.map((key) => {
      const smallerKeyMapping: Record<SemanticElmentSize, ThemeLayoutSizes> = { sm: 'xs', md: 'sm', lg: 'md' }
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
