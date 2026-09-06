import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type { TypographyStyleToken } from '@helpwave/hightide-design/theme-tokens'
import {
  buttonTokens,
  toButtonIconSize,
  type ButtonTokenResolver,
  type ButtonTokens,
  type PressableStateValue
} from '@helpwave/hightide-design/component-tokens'
import {
  toTypographySize,
  type ButtonVariant,
  type ControlElementLayoutToken,
  type PressableColoringTokens
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'
import {
  mapButtonVariant,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint
} from './semantic'
import { iconTokenResolver } from './icon'

type ButtonTokenState = PressableStateValue | ButtonVariant

type ButtonParams = {
  layout: ControlElementLayoutToken,
  coloring: PressableColoringTokens,
  tint: ColorToken,
  textStyle: TypographyStyleToken,
  iconSize: number,
  iconStrokeWidth: number,
  gap: number,
}

export const buttonTokenResolver: ButtonTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const variant = overrides.variant ?? 'filled'
  const { colorVariant, style } = mapButtonVariant(variant)
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
  const textStyle = themeTokens.typography.label[toTypographySize(size)]
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: {
      size: toButtonIconSize(size),
    },
  })
  const states = new Set<ButtonTokenState>([...state, variant])

  return resolveTokenConfig<ButtonTokens>(
    buttonTokens,
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
      } satisfies ButtonParams,
    }
  )
}
