import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import {
  componentSizes,
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'

export type IconState = {
  size?: ComponentSize,
}

export type IconThemeTokens = {
  size: number,
  strokeWidth: number,
}

export const createIconSizeTokens = (
  themeTokens: ThemeTokens
): Record<ComponentSize, IconThemeTokens> => {
  const insideControl = createElementLayoutTokens(themeTokens).insideControl

  return Object.fromEntries(
    componentSizes.map((size) => [size, {
      size: insideControl[size].size - 2 * themeTokens.spacing.xs,
      strokeWidth: themeTokens.borders.borderWidths.normal,
    } satisfies IconThemeTokens])
  ) as Record<ComponentSize, IconThemeTokens>
}

export const hightideIconTokenResolver: ComponentTokenResolver<
  ThemeTokens,
  IconState,
  IconThemeTokens
> = ({ themeTokens, state }) => createIconSizeTokens(themeTokens)[state.size ?? 'md']
