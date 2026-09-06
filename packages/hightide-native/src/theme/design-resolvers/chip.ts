import type { TypographyStyleToken } from '@helpwave/hightide-design/theme-tokens'
import {
  chipTokens,
  toButtonIconSize,
  type ChipTokenResolver,
  type ChipTokens
} from '@helpwave/hightide-design/component-tokens'
import {
  mapChipVariant,
  toTypographySize,
  type ColoringToken,
  type InsideControlElementLayoutToken
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'
import {
  resolveColoringColorVariant,
  resolveColoringStyle
} from './semantic'
import { iconTokenResolver } from './icon'

type ChipParams = {
  layout: InsideControlElementLayoutToken,
  coloring: ColoringToken,
  textStyle: TypographyStyleToken,
  gap: number,
  iconSize: number,
  iconStrokeWidth: number,
}

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

  return resolveTokenConfig<ChipTokens>(
    chipTokens,
    new Set(),
    {
      theme: themeTokens,
      params: {
        layout,
        coloring,
        textStyle,
        gap: size === 'sm' || size === 'xs' ? themeTokens.spacing.xs : themeTokens.spacing.sm,
        iconSize: iconSizeTokens.size ?? themeTokens.icongraphy.sizes.md,
        iconStrokeWidth: iconSizeTokens.strokeWidth ?? themeTokens.icongraphy.strokeWidth,
      } satisfies ChipParams,
    }
  )
}
