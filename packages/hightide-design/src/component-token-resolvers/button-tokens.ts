import {
  mapButtonVariant,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint,
  toTypographySize,
  type ButtonVariant,
  type ComponentSize
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { toButtonIconSize } from './icon-size'
import { iconTokenResolver, type IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import { type PressableState } from './pressable-tokens'

export type ButtonState = PressableState

export const buttonVariants = [
  'elevated',
  'filled',
  'tonal',
  'outlined',
  'foreground',
] as const satisfies readonly ButtonVariant[]

export type ButtonComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    variant?: ButtonVariant,
  },
  state: ButtonState,
}

export type ButtonTokens = {
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
  text: TextStyleTokens,
}

export type ButtonTokenResolver = ComponentTokenResolver<
  ButtonComponentResolverProps,
  ButtonTokens
>

export const buttonTokenResolver: ButtonTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const variant = overrides.variant ?? 'filled'
  const { colorVariant, style, elevated } = mapButtonVariant(variant)
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
  const hasBorder = resolved.border !== 'transparent'
  const hasOutline = resolved.outline !== 'transparent'
  const layout = semanticResolvers.controlLayout({ themeTokens, size })
  const insetForBordered = Math.max(layout.inset - layout.borderWidth, 0)
  const textStyle = themeTokens.typography.label[toTypographySize(size)]
  const gap = themeTokens.spacing[size]
  const isHovered = state.has('hovered')
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size: toButtonIconSize(size) },
  })

  return {
    container: {
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
        borderRadius: { type: 'all', value: layout.borderRadius },
      },
      padding: {
        type: 'physicalAxis',
        vertical: hasBorder ? insetForBordered : layout.inset,
        horizontal: hasBorder
          ? Math.max(layout.horizontalContentPadding - layout.borderWidth, 0)
          : layout.horizontalContentPadding,
      },
      layout: {
        gap,
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'center',
        selfCrossAxisAlignment: 'start',
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
    text: {
      color: resolved.foreground,
      fontSize: textStyle.fontSize,
      fontWeight: textStyle.fontWeight,
      fontFamily: textStyle.fontFamily,
      lineHeight: textStyle.lineHeight,
    },
  }
}
