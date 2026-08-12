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
import type { TextStyleTokens } from './text-style-tokens'
import { type PressableState } from './pressable'

export type ButtonState = PressableState

export type ButtonComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    variant?: PressableVariant,
  },
  state: ButtonState,
}

export type ButtonTokens = {
  touchTarget: ContainerTokens,
  visualContainer: ContainerTokens,
  stateLayer: ContainerTokens,
  text: TextStyleTokens,
}

export type ButtonTokenResolver = ComponentTokenResolver<
  ButtonComponentResolverProps,
  ButtonTokens
>

const touchTargetSize = 44

export const buttonTokenResolver: ButtonTokenResolver = ({
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
  const hasBorder = resolved.border !== 'transparent'
  const hasOutline = resolved.outline !== 'transparent'
  const layout = semanticResolvers.controlLayout({ themeTokens, size })
  const insetForBordered = Math.max(layout.inset - layout.borderWidth, 0)
  const textStyle = themeTokens.typography.label[size]
  const gap = themeTokens.spacing[size]
  const isHovered = state.has('hovered')

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
      backgroundColor: resolved.background,
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
        width: themeTokens.focusOutline.width,
        offset: themeTokens.focusOutline.offset,
        style: themeTokens.focusOutline.style,
        color: resolved.outline,
      } : undefined,
      decoration: elevated ? {
        shadow: isHovered
          ? themeTokens.elevation.level2
          : themeTokens.elevation.level1,
      } : undefined,
      size: {
        minHeight: layout.size,
      },
      shape: {
        borderRadius: layout.borderRadius,
        padding: {
          vertical: hasBorder ? insetForBordered : layout.inset,
          horizontal: hasBorder
            ? Math.max(layout.horizontalContentPadding - layout.borderWidth, 0)
            : layout.horizontalContentPadding,
        },
      },
      layout: {
        gap,
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    stateLayer: {
      backgroundColor: tint,
    },
    text: {
      color: resolved.foreground,
      fontSize: textStyle.fontSize,
      fontWeight: textStyle.fontWeight,
      fontFamily: textStyle.fontFamily,
      lineHeight: textStyle.lineHeight,
    },
  }
}
