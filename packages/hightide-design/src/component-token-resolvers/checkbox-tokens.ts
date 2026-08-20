import {
  resolveInputColoring,
  resolvePressableStateLayerTint,
  type ComponentSize
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import { toPressableState } from './pressable-tokens'
import {
  inputStateValues,
  toInputState
} from './input-tokens'

export const checkboxStateValues = [
  ...inputStateValues,
  'checked',
  'indeterminate',
] as const

export type CheckboxStateValue = typeof checkboxStateValues[number]

export type CheckboxState = ReadonlySet<CheckboxStateValue>

export const checkboxStateValueSet: ReadonlySet<CheckboxStateValue> = new Set(checkboxStateValues)

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
  stateLayer: ContainerTokens,
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
  const { color, borderWidth: borderWidthTokens } = themeTokens
  const accentPair = overrides.color ?? color.primary
  const element = semanticResolvers.controlLayout({ themeTokens, size })
  const borderWidth = borderWidthTokens.normal
  const inset = Math.floor(element.inset * 0.5)
  const dimension = Math.round(element.size * 0.5)
  const isActive = state.has('checked') || state.has('indeterminate')
  const coloring = resolveInputColoring({
    themeTokens,
    state: toInputState(state),
    color: overrides.color,
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: toPressableState(state),
    color: accentPair.color,
  })

  const backgroundColor = state.has('disabled')
    ? color.disabled.color
    : isActive ? accentPair.color : color.surface.color

  return {
    container: {
      backgroundColor,
      opacity: state.has('disabled') ? 0.6 : 1,
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
        borderRadius: {
          type: 'all',
          value: overrides.isRounded ? dimension / 2 : themeTokens.borderRadius.sm,
        },
      },
      padding: {
        type: 'physicalAxis',
        vertical: inset,
        horizontal: inset,
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
      outline: state.has('focusVisible') ? {
        ...themeTokens.focusOutline,
        color: state.has('invalid')
          ? color.negative.color
          : accentPair.color,
      } : undefined,
    },
    stateLayer: {
      backgroundColor: tint,
      shape: {
        borderRadius: {
          type: 'all',
          value: overrides.isRounded ? element.size / 2 : themeTokens.borderRadius[size],
        },
      },
    },
    icon: {
      color: isActive ? accentPair.onColor : accentPair.color,
      size: dimension - 2 * inset - 2 * borderWidth,
      strokeWidth: borderWidth,
    },
  }
}
