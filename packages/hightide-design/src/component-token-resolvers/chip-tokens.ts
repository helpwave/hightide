import {
  resolveColoringStyle,
  type ChipColoringStyle,
  type ComponentSize
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export type ChipComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    coloringStyle?: ChipColoringStyle,
  },
}

export type ChipTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
}

export type ChipTokenResolver = ComponentTokenResolver<
  ChipComponentResolverProps,
  ChipTokens
>

export const chipTokenResolver: ChipTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
}) => {
  const size = overrides.size ?? 'md'
  const coloringStyle = overrides.coloringStyle ?? 'filled'
  const coloring = resolveColoringStyle({
    themeTokens,
    colorPair: overrides.color ?? themeTokens.color.primary,
    style: coloringStyle,
  })
  const border = coloringStyle === 'outline' || coloringStyle === 'tonal-outline'
    ? coloring.accent
    : 'transparent'
  const hasBorder = border !== 'transparent'
  const layout = semanticResolvers.insideControlLayout({ themeTokens, size })
  const textStyle = themeTokens.typography.label[size]
  const gap = size === 'sm' ? themeTokens.spacing.xs : themeTokens.spacing.sm
  const horizontalPadding = layout.inset + layout.paddingExtension

  return {
    container: {
      backgroundColor: coloring.background,
      border: hasBorder ? {
        width: {
          type: 'all',
          value: layout.borderWidth,
        },
        color: {
          type: 'all',
          value: border,
        },
      } : undefined,
      size: {
        minWidth: 0,
        minHeight: layout.size,
      },
      shape: {
        borderRadius: layout.borderRadius,
        padding: {
          vertical: hasBorder
            ? Math.max(layout.inset - layout.borderWidth, 0)
            : layout.inset,
          horizontal: hasBorder
            ? Math.max(horizontalPadding - layout.borderWidth, 0)
            : horizontalPadding,
        },
      },
      layout: { gap },
    },
    text: {
      ...textStyle,
      color: coloring.text,
    },
  }
}
