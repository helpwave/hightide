import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import type { TypographyStyleToken } from '@helpwave/hightide-design/theme-tokens'
import {
  pressableTokens,
  toButtonIconSize,
  type PressableStateValue,
  type PressableTokenResolver,
  type PressableTokens
} from '@helpwave/hightide-design/component-tokens'
import {
  toTypographySize,
  type ControlElementLayoutToken,
  type PressableColoringTokens
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'
import {
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint
} from './semantic'
import { iconTokenResolver } from './icon'

type PressableTokenState = PressableStateValue | 'outlined' | 'additionalHorizontalPadding'

type PressableParams = {
  layout: ControlElementLayoutToken,
  coloring: PressableColoringTokens,
  tint: ColorToken,
  textStyle: TypographyStyleToken,
  iconSize: number,
  iconStrokeWidth: number,
  gap: number,
}

export const pressableTokenResolver: PressableTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const coloringStyle = overrides.coloringStyle ?? 'foreground'
  const coloringColorVariant = overrides.coloringColorVariant ?? 'normal'
  const hasAdditionalHorizontalPadding = overrides.hasAdditionalHorizontalPadding ?? false
  const colorPair = overrides.color ?? (
    coloringStyle === 'filled'
      ? themeTokens.color.surface
      : {
        color: themeTokens.color.surface.onColor,
        onColor: themeTokens.color.surface.color,
      }
  )
  const coloring = resolveColoringStyle({
    themeTokens,
    coloring: resolveColoringColorVariant({
      themeTokens,
      colorPair,
      variant: coloringColorVariant,
    }),
    style: coloringStyle,
  })
  const resolved = resolvePressableColoring({
    themeTokens,
    coloring,
    variant: coloringStyle === 'filled' ? 'filled' : 'foreground',
    state,
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: state,
    color: coloring.foreground,
  })
  const layout = semanticResolvers.controlLayout({ themeTokens, size })
  const textStyle = themeTokens.typography.label[toTypographySize(size)]
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size: toButtonIconSize(size) },
  })
  const states = new Set<PressableTokenState>(state)

  if (resolved.outline !== HexColorUtils.transparent) {
    states.add('outlined')
  }

  if (hasAdditionalHorizontalPadding) {
    states.add('additionalHorizontalPadding')
  }

  return resolveTokenConfig<PressableTokens>(
    pressableTokens,
    states,
    {
      theme: themeTokens,
      params: {
        layout,
        coloring: resolved,
        tint,
        textStyle,
        iconSize: iconSizeTokens.size ?? themeTokens.icongraphy.sizes.md,
        iconStrokeWidth: iconSizeTokens.strokeWidth ?? themeTokens.icongraphy.strokeWidth,
        gap: themeTokens.spacing[size],
      } satisfies PressableParams,
    }
  )
}
