import type {
  ComponentSize,
  ThemeBorderTokens,
  ThemePaddingExtensionTokens,
  ThemePaddingTokens,
  ThemeSizeTokens
} from '../theme/layout'
import type { ThemeTokens } from '../theme/theme-tokens'

export type ControlElementLayoutToken = {
  size: number,
  inset: number,
  border: number,
  minimumWidth?: number,
  horizontalContentPadding?: number,
}

export type ContainerLayoutToken = {
  size?: number,
  insetY: number,
  insetX: number,
  minimumWidth?: number,
  minimumHeight?: number,
}

export type ElementLayoutTokens = {
  control: Record<ComponentSize, ControlElementLayoutToken>,
  container: Record<ComponentSize, ContainerLayoutToken>,
}

export type SemanticBorderTokens = {
  thin: number,
  base: number,
  thick: number,
}

export type IconTheme = {
  size: number,
}

export type IconThemeTokens = Record<ComponentSize, IconTheme>

const controlMinimumWidths: Record<ComponentSize, number> = {
  xs: 80,
  sm: 112,
  md: 144,
  lg: 180,
  xl: 200,
}

const componentSizes: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

export const toHightideSemanticBorder = (
  border: ThemeBorderTokens
): SemanticBorderTokens => ({
  thin: border.xs,
  base: border.md,
  thick: border.xl,
})

export const toHightideElementLayout = ({
  size,
  padding,
  paddingExtension,
  border,
}: {
  size: ThemeSizeTokens,
  padding: ThemePaddingTokens,
  paddingExtension: ThemePaddingExtensionTokens,
  border: ThemeBorderTokens,
}): ElementLayoutTokens => {
  const control = Object.fromEntries(
    componentSizes.map((key) => {
      const inset = padding[key]
      return [key, {
        size: size[key],
        inset,
        border: border[key],
        minimumWidth: controlMinimumWidths[key],
        horizontalContentPadding: inset + paddingExtension[key],
      } satisfies ControlElementLayoutToken]
    })
  ) as Record<ComponentSize, ControlElementLayoutToken>

  const container = Object.fromEntries(
    componentSizes.map((key) => {
      const inset = padding[key]
      return [key, {
        size: size[key],
        insetY: inset,
        insetX: inset + paddingExtension[key],
        minimumWidth: controlMinimumWidths[key],
        minimumHeight: size[key],
      } satisfies ContainerLayoutToken]
    })
  ) as Record<ComponentSize, ContainerLayoutToken>

  return { control, container }
}

export const toHightideIconTheme = (
  control: ElementLayoutTokens['control']
): IconThemeTokens => {
  return Object.fromEntries(
    componentSizes.map((key) => {
      const token = control[key]
      return [key, {
        size: token.size - 2 * token.inset,
      } satisfies IconTheme]
    })
  ) as IconThemeTokens
}

export const toHightideElementLayoutFromTheme = (
  themeTokens: ThemeTokens
): {
  elementLayout: ElementLayoutTokens,
  border: SemanticBorderTokens,
  icon: IconThemeTokens,
} => {
  const elementLayout = toHightideElementLayout({
    size: themeTokens.size,
    padding: themeTokens.padding,
    paddingExtension: themeTokens.paddingExtension,
    border: themeTokens.border,
  })

  return {
    elementLayout,
    border: toHightideSemanticBorder(themeTokens.border),
    icon: toHightideIconTheme(elementLayout.control),
  }
}
