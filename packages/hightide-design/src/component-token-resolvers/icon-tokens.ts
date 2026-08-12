import type { ColorToken } from '../primitive-tokens'
import type { IconSize } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'

export type IconComponentResolverProps = {
  overrides: {
    size?: IconSize,
  },
}

export type IconTokens = {
  size?: number,
  strokeWidth?: number,
  color?: ColorToken,
}

export type IconTokenResolver = ComponentTokenResolver<
  IconComponentResolverProps,
  IconTokens
>

export const iconTokenResolver: IconTokenResolver = ({
  themeTokens,
  overrides,
}) => {
  const size = overrides.size ?? 'md'

  return {
    size: themeTokens.icongraphy.sizes[size],
    strokeWidth: themeTokens.icongraphy.strokeWidth,
    color: themeTokens.color.primary.color,
  }
}
