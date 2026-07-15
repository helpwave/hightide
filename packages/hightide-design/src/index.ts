export * from './types'
export * from './tokens'
export * from './helpers'

export type { SemanticColors as SemanticColorTokenMap } from './types'
export type { ComponentColors as ComponentColorTokenMap } from './types'
export type { ColorValue as HexColor } from './types'
export type { RemValue } from './helpers/units'

import { componentLayouts } from './tokens/layouts/component-layouts'
import { themes } from './tokens/themes'

export { colorPalettes, themes, componentLayouts } from './tokens'

export const semanticColors = {
  light: themes.light.semantic,
  dark: themes.dark.semantic,
} as const

export const componentColors = {
  light: themes.light.component,
  dark: themes.dark.component,
} as const

export const spacing = {
  base: `${componentLayouts.shared.spacingBase / 16}rem`,
  drawerIndent: `${componentLayouts.shared.drawerIndent / 16}rem`,
  scrollbarWidth: `${componentLayouts.shared.scrollbarWidth / 16}rem`,
  scrollbarPadding: `${componentLayouts.shared.scrollbarPadding / 16}rem`,
  coloringOutlineWidth: `${componentLayouts.shared.coloringOutlineWidth / 16}rem`,
} as const

export const elementSizes = {
  xs: {
    height: `${componentLayouts.element.xs.height / 16}rem`,
    borderRadius: `${componentLayouts.element.xs.borderRadius / 16}rem`,
  },
  sm: {
    height: `${componentLayouts.element.sm.height / 16}rem`,
    borderRadius: `${componentLayouts.element.sm.borderRadius / 16}rem`,
  },
  md: {
    height: `${componentLayouts.element.md.height / 16}rem`,
    borderRadius: `${componentLayouts.element.md.borderRadius / 16}rem`,
  },
  lg: {
    height: `${componentLayouts.element.lg.height / 16}rem`,
    borderRadius: `${componentLayouts.element.lg.borderRadius / 16}rem`,
  },
} as const

export const inputElementSizes = {
  md: {
    height: `${componentLayouts.input.md.height / 16}rem`,
    paddingX: `${componentLayouts.input.md.paddingX / 16}rem`,
    paddingY: `${componentLayouts.input.md.paddingY / 16}rem`,
    borderRadius: `${componentLayouts.input.md.borderRadius / 16}rem`,
  },
} as const

export const iconSizes = {
  xs: {
    size: `${componentLayouts.icon.xs.size / 16}rem`,
    strokeWidth: componentLayouts.icon.xs.strokeWidth,
  },
  sm: {
    size: `${componentLayouts.icon.sm.size / 16}rem`,
    strokeWidth: componentLayouts.icon.sm.strokeWidth,
  },
  md: {
    size: `${componentLayouts.icon.md.size / 16}rem`,
    strokeWidth: componentLayouts.icon.md.strokeWidth,
  },
  lg: {
    size: `${componentLayouts.icon.lg.size / 16}rem`,
    strokeWidth: componentLayouts.icon.lg.strokeWidth,
  },
} as const

export const elementPadding = {
  xs: {
    vertical: `${componentLayouts.elementPadding.xs.vertical / 16}rem`,
    horizontal: `${componentLayouts.elementPadding.xs.horizontal / 16}rem`,
  },
  sm: {
    vertical: `${componentLayouts.elementPadding.sm.vertical / 16}rem`,
    horizontal: `${componentLayouts.elementPadding.sm.horizontal / 16}rem`,
  },
  md: {
    vertical: `${componentLayouts.elementPadding.md.vertical / 16}rem`,
    horizontal: `${componentLayouts.elementPadding.md.horizontal / 16}rem`,
  },
  lg: {
    vertical: `${componentLayouts.elementPadding.lg.vertical / 16}rem`,
    horizontal: `${componentLayouts.elementPadding.lg.horizontal / 16}rem`,
  },
} as const

export const buttonPadding = {
  xs: {
    paddingY: `${componentLayouts.button.xs.paddingY / 16}rem`,
    paddingX: `${componentLayouts.button.xs.paddingX / 16}rem`,
    paddingYOutline: `${componentLayouts.button.xs.paddingYOutline / 16}rem`,
    paddingXOutline: `${componentLayouts.button.xs.paddingXOutline / 16}rem`,
    gap: `${componentLayouts.button.xs.gap / 16}rem`,
    minWidth: `${componentLayouts.button.xs.minWidth / 16}rem`,
    borderRadius: `${componentLayouts.button.xs.borderRadius / 16}rem`,
  },
  sm: {
    paddingY: `${componentLayouts.button.sm.paddingY / 16}rem`,
    paddingX: `${componentLayouts.button.sm.paddingX / 16}rem`,
    paddingYOutline: `${componentLayouts.button.sm.paddingYOutline / 16}rem`,
    paddingXOutline: `${componentLayouts.button.sm.paddingXOutline / 16}rem`,
    gap: `${componentLayouts.button.sm.gap / 16}rem`,
    minWidth: `${componentLayouts.button.sm.minWidth / 16}rem`,
    borderRadius: `${componentLayouts.button.sm.borderRadius / 16}rem`,
  },
  md: {
    paddingY: `${componentLayouts.button.md.paddingY / 16}rem`,
    paddingX: `${componentLayouts.button.md.paddingX / 16}rem`,
    paddingYOutline: `${componentLayouts.button.md.paddingYOutline / 16}rem`,
    paddingXOutline: `${componentLayouts.button.md.paddingXOutline / 16}rem`,
    gap: `${componentLayouts.button.md.gap / 16}rem`,
    minWidth: `${componentLayouts.button.md.minWidth / 16}rem`,
    borderRadius: `${componentLayouts.button.md.borderRadius / 16}rem`,
  },
  lg: {
    paddingY: `${componentLayouts.button.lg.paddingY / 16}rem`,
    paddingX: `${componentLayouts.button.lg.paddingX / 16}rem`,
    paddingYOutline: `${componentLayouts.button.lg.paddingYOutline / 16}rem`,
    paddingXOutline: `${componentLayouts.button.lg.paddingXOutline / 16}rem`,
    gap: `${componentLayouts.button.lg.gap / 16}rem`,
    minWidth: `${componentLayouts.button.lg.minWidth / 16}rem`,
    borderRadius: `${componentLayouts.button.lg.borderRadius / 16}rem`,
  },
} as const

export const iconButtonPadding = {
  xs: {
    paddingYOutline: `${componentLayouts.iconButton.xs.paddingYOutline / 16}rem`,
    paddingXOutline: `${componentLayouts.iconButton.xs.paddingXOutline / 16}rem`,
    borderRadius: `${componentLayouts.iconButton.xs.borderRadius / 16}rem`,
  },
  sm: {
    paddingYOutline: `${componentLayouts.iconButton.sm.paddingYOutline / 16}rem`,
    paddingXOutline: `${componentLayouts.iconButton.sm.paddingXOutline / 16}rem`,
    borderRadius: `${componentLayouts.iconButton.sm.borderRadius / 16}rem`,
  },
  md: {
    paddingYOutline: `${componentLayouts.iconButton.md.paddingYOutline / 16}rem`,
    paddingXOutline: `${componentLayouts.iconButton.md.paddingXOutline / 16}rem`,
    borderRadius: `${componentLayouts.iconButton.md.borderRadius / 16}rem`,
  },
  lg: {
    paddingYOutline: `${componentLayouts.iconButton.lg.paddingYOutline / 16}rem`,
    paddingXOutline: `${componentLayouts.iconButton.lg.paddingXOutline / 16}rem`,
    borderRadius: `${componentLayouts.iconButton.lg.borderRadius / 16}rem`,
  },
} as const

export { colorPalettes as basicColorPalette } from './tokens/palettes'
