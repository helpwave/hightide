import type { ColorToken } from '../primitive-tokens/color'
import type { PressableColoringStyle } from '../semantic-token-resolvers/types'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import { resolveColorPairColoring } from './coloring'
import type { ComponentTokenResolver } from './component-token-resolver'
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

export type IconButtonContainerTokens = {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: ColorToken,
  borderColor: ColorToken,
  borderWidth: number,
  width: number,
  height: number,
  borderRadius: number,
  overflow: 'hidden',
}

export type IconButtonIconTokens = {
  color: ColorToken,
}

export type IconButtonThemeTokens = {
  container: IconButtonContainerTokens,
  icon: IconButtonIconTokens,
  text: TextStyleTokens,
}

export const hightideIconButtonTokenResolver: ComponentTokenResolver<
  IconButtonComponentResolverProps,
  IconButtonThemeTokens
> = ({ themeTokens, semanticResolvers, overrides, state }) => {
  const size = overrides.size ?? 'md'
  const coloring = resolveColorPairColoring({
    themeTokens,
    semanticResolvers,
    colorPair: overrides.color ?? themeTokens.color.primary,
    style: overrides.coloringStyle ?? 'filled',
    state,
  })
  const borderColor = coloring.outlineColor ?? coloring.borderColor
  const layout = createElementLayoutTokens(themeTokens).control[size]
  const textStyle = themeTokens.typography.label[size]

  return {
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: coloring.color,
      borderColor: borderColor ?? 'transparent',
      borderWidth: borderColor !== undefined ? layout.borderWidth : 0,
      width: layout.size,
      height: layout.size,
      borderRadius: layout.borderRadius,
      overflow: 'hidden',
    },
    icon: {
      color: coloring.onColor,
    },
    text: {
      ...textStyle,
      color: coloring.onColor,
    },
  }
}
