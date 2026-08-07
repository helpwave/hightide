import {
  resolveColoringStyle,
  resolvePressableColoring,
  type ComponentSize,
  type PressableColoringStyle
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import { toActivePressableStates, type PressableInteractionState } from './pressable'

export type ButtonState = PressableInteractionState

export type ButtonComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    coloringStyle?: PressableColoringStyle,
  },
  state: ButtonState,
}

export type ButtonTokens = {
  container: ContainerTokens,
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
  const coloringStyle = overrides.coloringStyle ?? 'filled'
  const coloring = resolveColoringStyle({
    themeTokens,
    colorPair: overrides.color ?? themeTokens.color.primary,
    style: coloringStyle,
  })
  const resolved = resolvePressableColoring({
    themeTokens,
    coloring,
    style: coloringStyle,
    state: toActivePressableStates(state ?? {}),
  })
  const hasBorder = resolved.border !== 'transparent'
  const hasOutline = resolved.outline !== 'transparent'
  const layout = semanticResolvers.controlLayout({ themeTokens, size })
  const insetForBordered = Math.max(layout.inset - layout.borderWidth, 0)
  const textStyle = themeTokens.typography.label[size]
  const gap = themeTokens.spacing[size]

  return {
    container: {
      backgroundColor: resolved.background,
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
        width: themeTokens.focusOutline.width,
        offset: themeTokens.focusOutline.offset,
        style: themeTokens.focusOutline.style,
        color: resolved.outline,
      } : undefined,
      size: {
        minWidth: layout.minimumWidth,
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
    text: {
      color: resolved.text,
      fontSize: textStyle.fontSize,
      fontWeight: textStyle.fontWeight,
      fontFamily: textStyle.fontFamily,
      lineHeight: textStyle.lineHeight,
    },
  }
}
