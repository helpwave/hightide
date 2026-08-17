import {
  mapIconButtonVariant,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint,
  type ComponentSize,
  type IconButtonVariant
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { toButtonIconSize } from './icon-size'
import { iconTokenResolver, type IconTokens } from './icon-tokens'
import { type PressableState } from './pressable-tokens'

export type IconButtonState = PressableState

export const iconButtonVariants = [
  'elevated',
  'filled',
  'tonal',
  'foreground',
] as const satisfies readonly IconButtonVariant[]

export type IconButtonComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    variant?: IconButtonVariant,
  },
  state: IconButtonState,
}

export type IconButtonTokens = {
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
}

export type IconButtonTokenResolver = ComponentTokenResolver<
  IconButtonComponentResolverProps,
  IconButtonTokens
>

export const iconButtonTokenResolver: IconButtonTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const variant = overrides.variant ?? 'filled'
  const { colorVariant, style, elevated } = mapIconButtonVariant(variant)
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
    state: state,
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: state,
    color: coloring.foreground,
  })
  const visualBackground = state.has('disabled')
    ? resolved.background
    : coloring.background
  const hasBorder = resolved.border !== 'transparent'
  const hasOutline = resolved.outline !== 'transparent'
  const layout = semanticResolvers.controlLayout({ themeTokens, size })
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size: toButtonIconSize(size) },
  })
  const isHovered = state.has('hovered')

  return {
    container: {
      backgroundColor: visualBackground,
      opacity: state.has('disabled') ? 0.6 : 1,
      border: hasBorder ? {
        width: {
          type: 'all',
          value: layout.borderWidth,
        },
        color: {
          type: 'all',
          value: resolved.border,
        },
      } : undefined,
      outline: hasOutline ? {
        ...themeTokens.focusOutline,
        color: resolved.outline,
      } : undefined,
      decoration: elevated ? {
        shadow: isHovered
          ? themeTokens.elevation.level2
          : themeTokens.elevation.level1,
      } : undefined,
      size: {
        width: layout.size,
        height: layout.size,
      },
      shape: {
        borderRadius: { type: 'all', value: layout.borderRadius },
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    stateLayer: {
      backgroundColor: tint,
      shape: {
        borderRadius: { type: 'all', value: layout.borderRadius },
      },
    },
    icon: {
      size: iconSizeTokens.size,
      strokeWidth: iconSizeTokens.strokeWidth,
      color: resolved.foreground,
    },
  }
}
