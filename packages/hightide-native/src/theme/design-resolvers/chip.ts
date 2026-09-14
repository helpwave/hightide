import {
  chipTokens,
  toButtonIconSize,
  type ChipParams,
  type ChipTokenResolver,
  type ChipTokens
} from '@helpwave/hightide-design/component-tokens'
import {
  mapChipVariant,
  toTypographySize
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveConfigNode } from '@helpwave/hightide-design/component-tokens'
import {
  resolveColoringColorVariant,
  resolveColoringStyle
} from './semantic'
import { iconTokenResolver } from './icon'

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
  const layout = semanticResolvers.insideControlLayout({
    themeTokens,
    size,
  })
  const textStyle = themeTokens.typography.label[toTypographySize(size)]
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: {
      size: toButtonIconSize(size),
    },
  })

  return resolveConfigNode<ChipTokens>(
    chipTokens,
    {
      theme: themeTokens,
      params: {
        colors: {
          background: coloring.background,
          foreground: coloring.foreground,
        },
        numbers: {
          size: layout.size,
          borderRadius: layout.borderRadius,
          inset: layout.inset,
          paddingExtension: layout.paddingExtension,
          gap: size === 'sm' || size === 'xs' ? themeTokens.spacing.xs : themeTokens.spacing.sm,
          iconSize: iconSizeTokens.size ?? themeTokens.icongraphy.sizes.md,
          iconStrokeWidth: iconSizeTokens.strokeWidth ?? themeTokens.icongraphy.strokeWidth,
          fontSize: textStyle.fontSize,
          fontWeight: textStyle.fontWeight,
          lineHeight: textStyle.lineHeight,
        },
      } satisfies ChipParams,
      state: new Set(),
    }
  )
}
