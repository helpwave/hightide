import type { PressableColoringStyle } from '../semantic-token-resolvers/types'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import { resolveColorPairColoring } from './coloring'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import type { PressableInteractionState } from './pressable'

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

export const buttonTokenResolver: ButtonTokenResolver = ({ themeTokens, semanticResolvers, overrides, state }) => {
  const size = overrides.size ?? 'md'
  const coloringStyle = overrides.coloringStyle ?? 'filled'
  const coloring = resolveColorPairColoring({
    themeTokens,
    semanticResolvers,
    colorPair: overrides.color ?? themeTokens.color.primary,
    style: coloringStyle,
    state,
  })
  const hasBorder = coloring.borderColor !== undefined
  const layout = createElementLayoutTokens(themeTokens).control[size]
  const insetForBordered = Math.max(layout.inset - layout.borderWidth, 0)
  const textStyle = themeTokens.typography.label[size]
  const gap = themeTokens.spacing[size]

  return {
    container: {
      backgroundColor: coloring.color,
      border: hasBorder ? {
        width: layout.borderWidth,
        color: coloring.borderColor,
      } : undefined,
      outline: coloring.outlineColor !== undefined ? {
        // TODO dont use a hardcode 2 here create a outline style instead and use it here
        width:  2,
        color: coloring.outlineColor,
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
      color: coloring.onColor,
      fontSize: textStyle.fontSize,
      fontWeight: textStyle.fontWeight,
      fontFamily: textStyle.fontFamily,
      lineHeight: textStyle.lineHeight,
    },
  }
}
