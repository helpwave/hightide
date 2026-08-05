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

export type ButtonState = PressableInteractionState & {
  size?: ComponentSize,
  color?: ColorPairToken,
  coloringStyle?: PressableColoringStyle,
}

export type ButtonThemeTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
}

const isOutlineColoringStyle = (style: PressableColoringStyle): boolean => (
  style === 'outline' || style === 'tonal-outline'
)

export const hightideButtonTokenResolver: ComponentTokenResolver<
  ButtonState,
  ButtonThemeTokens
> = ({ themeTokens, semanticResolvers, state }) => {
  const size = state.size ?? 'md'
  const coloringStyle = state.coloringStyle ?? 'filled'
  const coloring = resolveColorPairColoring({
    themeTokens,
    semanticResolvers,
    colorPair: state.color ?? themeTokens.color.primary,
    style: coloringStyle,
    state,
  })
  const borderColor = coloring.outlineColor ?? coloring.borderColor
  const layout = createElementLayoutTokens(themeTokens).control[size]
  const outlinePadding = isOutlineColoringStyle(coloringStyle)
  const outlineInset = Math.max(layout.inset - layout.borderWidth, 0)
  const textStyle = themeTokens.typography.label[size]
  const gap = themeTokens.spacing[size]

  return {
    container: {
      backgroundColor: coloring.color,
      border: {
        width: borderColor !== undefined ? layout.borderWidth : 0,
        color: borderColor,
      },
      size: {
        minWidth: layout.minimumWidth,
        minHeight: layout.size,
      },
      shape: {
        borderRadius: layout.borderRadius,
        padding: {
          vertical: outlinePadding ? outlineInset : layout.inset,
          horizontal: outlinePadding
            ? Math.max(layout.horizontalContentPadding - layout.borderWidth, 0)
            : layout.horizontalContentPadding,
        },
      },
      layout: { gap },
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
