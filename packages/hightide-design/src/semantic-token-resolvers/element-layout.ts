import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type {
  ThemeLayoutSize,
  ThemeTypographySize
} from '../theme-tokens/theme-tokens-config'

export const componentSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export type ComponentSize = typeof componentSizes[number]

export const toTypographySize = (size: ComponentSize): ThemeTypographySize => {
  switch (size) {
  case 'xs':
    return 'sm'
  case 'xl':
    return 'lg'
  default:
    return size
  }
}

export type ControlElementLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
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

const paddingExtensionFor = (
  themeTokens: ThemeTokens,
  size: ThemeLayoutSize
): number => {
  const { spacing } = themeTokens
  const paddingExtension = {
    xs: spacing.sm,
    sm: spacing.md / 2 + spacing.xs,
    md: spacing.md + spacing.xs,
    lg: spacing.md + spacing.sm,
    xl: spacing.lg,
  } as const

  return paddingExtension[size]
}

export const resolveControlLayout = (params: {
  themeTokens: ThemeTokens,
  size: ThemeLayoutSize,
}): ControlElementLayoutToken => {
  const { themeTokens, size } = params
  const { size: sizes, shape, borderWidth } = themeTokens
  const inset = shape.padding[size]

  return {
    size: sizes[size],
    inset,
    borderWidth: borderWidth.normal,
    borderRadius: shape.borderRadius[size],
    horizontalContentPadding: inset + paddingExtensionFor(themeTokens, size),
  }
}

export const resolveTouchTargetSize = (params: {
  themeTokens: ThemeTokens,
}): number => (
  resolveControlLayout({
    themeTokens: params.themeTokens,
    size: 'md',
  }).size
)

export const resolveContainerLayout = (params: {
  themeTokens: ThemeTokens,
  size: ThemeLayoutSize,
}): ContainerLayoutToken => {
  const { themeTokens, size } = params
  const { size: sizes, shape } = themeTokens
  const inset = shape.padding[size]

  return {
    size: sizes[size],
    insetY: inset,
    insetX: inset + paddingExtensionFor(themeTokens, size),
    borderRadius: shape.borderRadius[size],
    minimumWidth: sizes[size],
    minimumHeight: sizes[size],
  }
}

export const resolveInsideControlLayout = (params: {
  themeTokens: ThemeTokens,
  size: ThemeLayoutSize,
}): InsideControlElementLayoutToken => {
  const { themeTokens, size } = params
  const smallerKeyMapping = { xs: 'xs', sm: 'xs', md: 'sm', lg: 'md', xl: 'lg' } as const
  const smallerKey = smallerKeyMapping[size]
  const token = resolveControlLayout({
    themeTokens,
    size,
  })

  return {
    size: token.size - 2 * token.inset - 2 * token.borderWidth,
    inset: themeTokens.shape.padding[smallerKey],
    borderWidth: themeTokens.borderWidth.thin,
    borderRadius: themeTokens.shape.borderRadius[smallerKey],
    paddingExtension: paddingExtensionFor(themeTokens, smallerKey),
  }
}
