import type { ComponentSize } from '../semantic-token-resolvers'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ColorToken } from '../primitive-tokens'

export type IconComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
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
  semanticResolvers,
  overrides,
}) => {
  const size = overrides.size ?? 'md'
  const insideControl = semanticResolvers.insideControlLayout({
    themeTokens,
    size,
  })

  return {
    size: insideControl.size - 2 * themeTokens.spacing.xs,
    strokeWidth: themeTokens.borders.borderWidths.normal,
    color: themeTokens.color.primary.color,
  }
}
