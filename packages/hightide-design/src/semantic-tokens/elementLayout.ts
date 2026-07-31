import type {
  ComponentSize,
  HightideThemeBorderWidthTokens,
  HightideThemePaddingExtensionTokens,
  HightideThemePaddingTokens,
  HightideThemeSizeTokens
} from '../theme-tokens/layout'
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

export type HightideSemanticElementLayoutTokens = {
  control: Record<ComponentSize, HightideControlElementLayoutToken>,
  container: Record<ComponentSize, HightideContainerLayoutToken>,
}

export type HightideIconTheme = {
  size: number,
}

export type HightideIconThemeTokens = Record<ComponentSize, HightideIconTheme>

const controlMinimumWidths: Record<ComponentSize, number> = {
  xs: 80,
  sm: 112,
  md: 144,
  lg: 180,
  xl: 200,
}

const componentSizes: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

export const toHightideElementLayout = ({
  size,
  padding,
  paddingExtension,
  border,
}: {
  size: HightideThemeSizeTokens,
  padding: HightideThemePaddingTokens,
  paddingExtension: HightideThemePaddingExtensionTokens,
  border: HightideThemeBorderWidthTokens,
}): HightideSemanticElementLayoutTokens => {
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

  return { control, container }
}

export const toHightideIconTheme = (
  control: HightideSemanticElementLayoutTokens['control']
): HightideIconThemeTokens => {
  return Object.fromEntries(
    componentSizes.map((key) => {
      const token = control[key]
      return [key, {
        size: token.size - 2 * token.inset,
      } satisfies HightideIconTheme]
    })
  ) as HightideIconThemeTokens
}

export const toHightideElementLayoutFromTheme = (
  themeTokens: HightideThemeTokens
): {
  elementLayout: HightideSemanticElementLayoutTokens,
  border: HightideThemeBorderWidthTokens,
  icon: HightideIconThemeTokens,
} => {
  const elementLayout = toHightideElementLayout({
    size: themeTokens.size,
    padding: themeTokens.padding,
    paddingExtension: themeTokens.paddingExtension,
    border: themeTokens.border,
  })

  return {
    elementLayout,
    border: themeTokens.border,
    icon: toHightideIconTheme(elementLayout.control),
  }
}
