import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import {
  componentSizes,
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ColorToken } from '../primitive-tokens'

export type IconComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
  },
}

export type IconTokens = {
  size: number,
  strokeWidth: number,
  color: ColorToken,
}

export const createIconSizeTokens = (
  themeTokens: ThemeTokens
): Record<ComponentSize, IconTokens> => {
  const insideControl = createElementLayoutTokens(themeTokens).insideControl

  return Object.fromEntries(
    componentSizes.map((size) => [size, {
      size: insideControl[size].size - 2 * themeTokens.spacing.xs,
      strokeWidth: themeTokens.borders.borderWidths.normal,
      color: themeTokens.color.primary.color
    } satisfies IconTokens])
  ) as Record<ComponentSize, IconTokens>
}

export type IconTokenResolver = ComponentTokenResolver<
  IconComponentResolverProps,
  IconTokens
>

export const iconTokenResolver: IconTokenResolver = ({ themeTokens, overrides }) => createIconSizeTokens(themeTokens)[overrides.size ?? 'md']
