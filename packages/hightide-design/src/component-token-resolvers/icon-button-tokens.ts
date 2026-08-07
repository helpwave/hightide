import {
  resolveColoringStyle,
  resolvePressableColoring,
  type PressableColoringStyle
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { createIconSizeTokens, type IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import { toActivePressableStates, type PressableInteractionState } from './pressable'

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
  const layout = createElementLayoutTokens(themeTokens).control[size]
  const iconSizeTokens = createIconSizeTokens(themeTokens)[size]
  const textStyle = themeTokens.typography.label[size]

  return {
    container: {
      backgroundColor: resolved.background,
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
      color: resolved.text,
    },
    text: {
      ...textStyle,
      color: resolved.text,
    },
  }
}
