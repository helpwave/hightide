import {
  resolveInputColoring,
  resolvePressableStateLayerTint,
  type ComponentSize
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import type { InputState } from './input-tokens'
import { toActivePressableStates } from './pressable'

export type CheckboxState = InputState & {
  isChecked?: boolean,
  isIndeterminate?: boolean,
}

export type CheckboxComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    isRounded?: boolean,
    color?: ColorPairToken,
  },
  state: CheckboxState,
}

export type CheckboxTokens = {
  container: ContainerTokens,
  visualContainer: ContainerTokens,
  icon: IconTokens,
}

export type CheckboxTokenResolver = ComponentTokenResolver<
  CheckboxComponentResolverProps,
  CheckboxTokens
>

export const checkboxTokenResolver: CheckboxTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const { color, borders } = themeTokens
  const accentPair = overrides.color ?? color.primary
  const element = semanticResolvers.controlLayout({ themeTokens, size })
  const borderWidth = borders.borderWidths.normal
  const inset = Math.floor(element.inset * 0.5)
  const dimension = Math.round(element.size * 0.5)
  const isActive = !!(state.isChecked || state.isIndeterminate)
  const coloring = resolveInputColoring({
    themeTokens,
    state,
    color: overrides.color,
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: toActivePressableStates(state),
    color: accentPair.color,
  })

  const backgroundColor = state.isDisabled
    ? color.disabled.color
    : isActive ? accentPair.color : color.surface.color

  // todo replace the md resolver with a touch target size
  const containerSize = Math.max(element.size, semanticResolvers.controlLayout({ themeTokens , size: 'md' }).size)

  return {
    container: {
      backgroundColor: tint,
      size: {
        width: containerSize,
        height: containerSize,
        minWidth: containerSize,
        maxWidth: containerSize,
        minHeight: containerSize,
        maxHeight: containerSize,
      },
      shape: {
        borderRadius: containerSize / 2,
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
      outline: state.isFocusVisible ? {
        color: 'transparent',
      } : undefined,
    },
    visualContainer: {
      backgroundColor,
      opacity: state.isDisabled ? 0.6 : 1,
      border: isActive ? undefined : {
        width: {
          type: 'all',
          value: borderWidth,
        },
        color: {
          type: 'all',
          value: coloring.border,
        },
      },
      size: {
        width: dimension,
        height: dimension,
      },
      shape: {
        borderRadius: overrides.isRounded ? dimension / 2 : themeTokens.shape.borderRadius.sm,
        padding: {
          vertical: inset,
          horizontal: inset,
        },
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
      outline: state.isFocusVisible === true ? {
        ...themeTokens.focusOutline,
        color: state.isInvalid === true
          ? color.negative.color
          : accentPair.color,
      } : undefined,
    },
    icon: {
      color: isActive ? accentPair.onColor : accentPair.color,
      size: dimension - 2 * inset - 2 * borderWidth,
      strokeWidth: borders.borderWidths.normal,
    },
  }
}
