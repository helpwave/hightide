import type {
  ThemeLayoutSize,
  ThemeTypographySize
} from './theme-tokens-config'
import type { ThemeTokens } from './theme-tokens'

export const componentSizes = ['sm', 'md', 'lg'] as const
export type ComponentSize = typeof componentSizes[number]

export type ControlElementLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  minimumWidth: number,
  horizontalContentPadding: number,
}

export type ContainerLayoutToken = {
  size: number,
  insetY: number,
  insetX: number,
  borderRadius: number,
  minimumWidth: number,
  minimumHeight: number,
}

export type InsideControlElementLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  paddingExtension: number,
}

export type ElementLayoutTokens = {
  control: Record<ThemeLayoutSize, ControlElementLayoutToken>,
  container: Record<ThemeLayoutSize, ContainerLayoutToken>,
  insideControl: Record<ThemeTypographySize, InsideControlElementLayoutToken>,
}

const controlMinimumWidths: Record<ThemeLayoutSize, number> = {
  xs: 80,
  sm: 112,
  md: 144,
  lg: 180,
  xl: 200,
}

const layoutSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly ThemeLayoutSize[]

export const createElementLayoutTokens = (
  themeTokens: ThemeTokens
): ElementLayoutTokens => {
  const { size, shape, borders, spacing } = themeTokens
  const paddingExtension = {
    xs: spacing.sm,
    sm: spacing.md / 2 + spacing.xs,
    md: spacing.md + spacing.xs,
    lg: spacing.md + spacing.sm,
    xl: spacing.lg,
  } as const

  const control = Object.fromEntries(
    layoutSizes.map((key) => {
      const inset = shape.padding[key]
      return [key, {
        size: size[key],
        inset,
        borderWidth: borders.borderWidths.normal,
        borderRadius: shape.borderRadius[key],
        minimumWidth: controlMinimumWidths[key],
        horizontalContentPadding: inset + paddingExtension[key],
      } satisfies ControlElementLayoutToken]
    })
  ) as Record<ThemeLayoutSize, ControlElementLayoutToken>

  const container = Object.fromEntries(
    layoutSizes.map((key) => {
      const inset = shape.padding[key]
      return [key, {
        size: size[key],
        insetY: inset,
        insetX: inset + paddingExtension[key],
        borderRadius: shape.borderRadius[key],
        minimumWidth: controlMinimumWidths[key],
        minimumHeight: size[key],
      } satisfies ContainerLayoutToken]
    })
  ) as Record<ThemeLayoutSize, ContainerLayoutToken>

  const insideControl = Object.fromEntries(
    (['sm', 'md', 'lg'] as const).map((key) => {
      const smallerKeyMapping = { sm: 'xs', md: 'sm', lg: 'md' } as const
      const smallerKey = smallerKeyMapping[key]
      const token = control[key]
      return [key, {
        size: token.size - 2 * token.inset - 2 * token.borderWidth,
        inset: shape.padding[smallerKey],
        borderWidth: borders.borderWidths.thin,
        borderRadius: shape.borderRadius[smallerKey],
        paddingExtension: paddingExtension[smallerKey],
      } satisfies InsideControlElementLayoutToken]
    })
  ) as Record<ThemeTypographySize, InsideControlElementLayoutToken>

  return { control, container, insideControl }
}
