import type { PressableColoringStyle } from '../semantic-token-resolvers/types'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import { resolveColorPairColoring } from './coloring'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { createIconSizeTokens, type IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import type { PressableInteractionState } from './pressable'

export type IconButtonState = PressableInteractionState

export type IconButtonComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    coloringStyle?: PressableColoringStyle,
  },
  state: IconButtonState,
}

export type IconButtonTokens = {
  container: ContainerTokens,
  icon: IconTokens,
  text: TextStyleTokens,
}

export type IconButtonTokenResolver = ComponentTokenResolver<
  IconButtonComponentResolverProps,
  IconButtonTokens
>

export const iconButtonTokenResolver: IconButtonTokenResolver = ({
  themeTokens,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const coloring = resolveColorPairColoring({
    themeTokens,
    colorPair: overrides.color ?? themeTokens.color.primary,
    style: overrides.coloringStyle ?? 'filled',
    state,
  })
  const borderColor = coloring.outlineColor ?? coloring.borderColor
  const layout = createElementLayoutTokens(themeTokens).control[size]
  const iconSizeTokens = createIconSizeTokens(themeTokens)[size]
  const textStyle = themeTokens.typography.label[size]

  return {
    container: {
      backgroundColor: coloring.color,
      border: borderColor !== undefined ? {
        width: {
          type: 'all',
          value: layout.borderWidth,
        },
        color: {
          type: 'all',
          value: borderColor,
        },
      } : undefined,
      outline: coloring.outlineColor !== undefined ? {
        ...themeTokens.focusOutline,
        color: coloring.outlineColor,
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
    icon: {
      size: iconSizeTokens.size,
      strokeWidth: iconSizeTokens.strokeWidth,
      color: coloring.onColor,
    },
    text: {
      ...textStyle,
      color: coloring.onColor,
    },
  }
}
