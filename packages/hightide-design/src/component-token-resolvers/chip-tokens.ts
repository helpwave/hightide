import {
  mapChipVariant,
  resolveColoringColorVariant,
  resolveColoringStyle,
  toTypographySize,
  type ChipVariant,
  type ComponentSize
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { toButtonIconSize } from './icon-size'
import { iconTokenResolver, type IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export type ChipComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    variant?: ChipVariant,
  },
}

export type ChipTokens = {
  container: ContainerTokens,
  icon: IconTokens,
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
  const variant = overrides.variant ?? 'filled'
  const { colorVariant, style } = mapChipVariant(variant)
  const coloring = resolveColoringStyle({
    themeTokens,
    coloring: resolveColoringColorVariant({
      themeTokens,
      colorPair: overrides.color ?? themeTokens.color.primary,
      variant: colorVariant,
    }),
    style,
  })
  const typographySize = toTypographySize(size)
  const layout = semanticResolvers.insideControlLayout({ themeTokens, size })
  const textStyle = themeTokens.typography.label[typographySize]
  const gap = size === 'sm' || size === 'xs' ? themeTokens.spacing.xs : themeTokens.spacing.sm
  const horizontalPadding = layout.inset + layout.paddingExtension
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size: toButtonIconSize(size) },
  })

  return {
    container: {
      backgroundColor: coloring.background,
      size: {
        minWidth: 0,
        minHeight: layout.size,
      },
      shape: {
        borderRadius: { type: 'all', value: layout.borderRadius },
      },
      padding: {
        type: 'physicalAxis',
        vertical: layout.inset,
        horizontal: horizontalPadding,
      },
      layout: {
        gap,
        direction: 'horizontal',
        mainAxisAlignment: 'start',
        crossAxisAlignment: 'center',
      },
    },
    icon: {
      size: iconSizeTokens.size,
      strokeWidth: iconSizeTokens.strokeWidth,
      color: coloring.foreground,
    },
    text: {
      ...textStyle,
      color: coloring.foreground,
    },
  }
}
