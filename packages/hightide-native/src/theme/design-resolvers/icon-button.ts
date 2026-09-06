import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import {
  iconButtonTokens,
  toButtonIconSize,
  type IconButtonTokenResolver,
  type IconButtonTokens,
  type PressableStateValue
} from '@helpwave/hightide-design/component-tokens'
import {
  mapIconButtonVariant,
  type ControlElementLayoutToken,
  type IconButtonVariant,
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

type IconButtonTokenState = PressableStateValue | IconButtonVariant

type IconButtonParams = {
  layout: ControlElementLayoutToken,
  coloring: PressableColoringTokens,
  background: ColorToken,
  tint: ColorToken,
  iconSize: number,
  iconStrokeWidth: number,
}

export const iconButtonTokenResolver: IconButtonTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const variant = overrides.variant ?? 'filled'
  const { colorVariant, style } = mapIconButtonVariant(variant)
  const coloring = resolveColoringStyle({
    themeTokens,
    coloring: resolveColoringColorVariant({
      themeTokens,
      colorPair: overrides.color ?? themeTokens.color.primary,
      variant: colorVariant,
    }),
    style,
  })
  const resolved = resolvePressableColoring({
    themeTokens,
    coloring,
    variant,
    state,
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: state,
    color: coloring.foreground,
  })
  const layout = semanticResolvers.controlLayout({
    themeTokens,
    size,
  })
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: {
      size: toButtonIconSize(size),
    },
  })
  const states = new Set<IconButtonTokenState>([...state, variant])

  return resolveTokenConfig<IconButtonTokens>(
    iconButtonTokens,
    states,
    {
      theme: themeTokens,
      params: {
        layout,
        coloring: resolved,
        background: state.has('disabled') ? resolved.background : coloring.background,
        tint,
        iconSize: iconSizeTokens.size ?? themeTokens.icongraphy.sizes.md,
        iconStrokeWidth: iconSizeTokens.strokeWidth ?? themeTokens.icongraphy.strokeWidth,
      } satisfies IconButtonParams,
    }
  )
}
