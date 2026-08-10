import {
  mapPressableVariant,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint,
  type ComponentSize,
  type PressableVariant
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { iconTokenResolver, type IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import { toActivePressableStates, type PressableInteractionState } from './pressable'

export type IconButtonState = PressableInteractionState

export type IconButtonComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    variant?: PressableVariant,
  },
  state: IconButtonState,
}

export type IconButtonTokens = {
  touchTarget: ContainerTokens,
  visualContainer: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
  text: TextStyleTokens,
}

export type IconButtonTokenResolver = ComponentTokenResolver<
  IconButtonComponentResolverProps,
  IconButtonTokens
>

const touchTargetSize = 44

export const iconButtonTokenResolver: IconButtonTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const variant = overrides.variant ?? 'filled'
  const { colorVariant, style, elevated } = mapPressableVariant(variant)
  const coloring = resolveColoringStyle({
    coloring: resolveColoringColorVariant({
      colorPair: overrides.color ?? themeTokens.color.primary,
      variant: colorVariant,
    }),
    style,
  })
  const fullStates = toActivePressableStates(state ?? {})
  const visualStates = toActivePressableStates({
    isDisabled: state?.isDisabled,
    isFocusVisible: state?.isFocusVisible,
  })
  const resolved = resolvePressableColoring({
    themeTokens,
    coloring,
    variant,
    state: visualStates,
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: fullStates,
    color: coloring.foreground,
  })
  const visualBackground = state?.isDisabled
    ? resolved.background
    : coloring.background
  const hasBorder = resolved.border !== 'transparent'
  const hasOutline = resolved.outline !== 'transparent'
  const layout = semanticResolvers.controlLayout({ themeTokens, size })
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size },
  })
  const textStyle = themeTokens.typography.label[size]
  const isHovered = state?.isHovered === true

  return {
    touchTarget: {
      size: {
        minWidth: touchTargetSize,
        minHeight: touchTargetSize,
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    visualContainer: {
      backgroundColor: visualBackground,
      opacity: state.isDisabled ? 0.6 : 1,
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
        borderRadius: layout.borderRadius,
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    stateLayer: {
      backgroundColor: tint,
    },
    icon: {
      size: iconSizeTokens.size,
      strokeWidth: iconSizeTokens.strokeWidth,
      color: resolved.foreground,
    },
    text: {
      ...textStyle,
      color: resolved.foreground,
    },
  }
}
