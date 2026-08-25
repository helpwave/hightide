import { resolveInputColoring, resolvePressableStateLayerTint } from '../semantic-token-resolvers'
import { hightideShadow } from '../primitive-tokens/shadow'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { iconTokenResolver, type IconTokens } from './icon-tokens'
import {
  pressableStateValues,
  type PressableStateValue
} from './pressable-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export const inputStateValues = [
  ...pressableStateValues,
  'readonly',
  'invalid',
] as const

export type InputStateValue = typeof inputStateValues[number]

export type InputState = ReadonlySet<InputStateValue>

export const inputStateValueSet: ReadonlySet<InputStateValue> = new Set(inputStateValues)

export const isInputStateValue = (value: string): value is InputStateValue => (
  inputStateValueSet.has(value as InputStateValue)
)

export const toInputState = (state: ReadonlySet<string>): InputState => {
  const active = new Set<InputStateValue>()
  for (const value of state) {
    if (isInputStateValue(value)) {
      active.add(value)
    }
  }
  return active
}

export type InputComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: InputState,
}

export type InputTextTokens = TextStyleTokens

export type InputTokens = {
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  text: InputTextTokens,
  placeholder: TextStyleTokens,
  icon: IconTokens,
}

export type InputTokenResolver = ComponentTokenResolver<
  InputComponentResolverProps,
  InputTokens
>

export const inputTokenResolver: InputTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const { typography } = themeTokens
  const layout = semanticResolvers.controlLayout({ themeTokens, size: 'md' })
  const textStyle = typography.body.md
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size: 'md' },
  })
  const coloring = resolveInputColoring({
    themeTokens,
    state,
    color: overrides?.color,
  })
  const placeholderColor = state.has('disabled')
    ? themeTokens.color.disabled.onColor
    : semanticResolvers.asDescription({
      themeTokens,
      colorPair: themeTokens.color.surface,
    })

  const interactionStates = new Set<PressableStateValue>()
  if (state.has('hovered') && !state.has('focused')) {
    interactionStates.add('hovered')
  }
  if (state.has('pressed')) {
    interactionStates.add('pressed')
  }

  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: interactionStates,
    color: coloring.text,
  })

  const focusShadow = state.has('focused') && coloring.border !== 'transparent'
    ? {
      ...hightideShadow.layout.basic.md,
      color: HexColorUtils.hexWithAlpha(coloring.border, 0.7),
    }
    : undefined

  return {
    container: {
      backgroundColor: coloring.background,
      opacity: state.has('disabled') ? 0.6 : 1,
      border: {
        width: {
          type: 'all',
          value: layout.borderWidth,
        },
        color: {
          type: 'all',
          value: coloring.border,
        },
      },
      outline:  {
        ...themeTokens.focusOutline,
        color: !state.has('focusVisible') ? 'transparent' :
          state.has('invalid')
            ? themeTokens.color.negative.color
            : (overrides?.color ?? themeTokens.color.primary).color,
      },
      decoration: focusShadow !== undefined ? {
        shadow: focusShadow,
      } : undefined,
      size: {
        minHeight: layout.size,
      },
      shape: {
        borderRadius: { type: 'all', value: layout.borderRadius },
      },
      padding: {
        type: 'physicalAxis',
        vertical: layout.inset,
        horizontal: layout.horizontalContentPadding - layout.borderWidth,
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'start',
        crossAxisAlignment: 'center',
      }
    },
    stateLayer: {
      backgroundColor: tint,
      position: {
        type: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 20,
      },
      shape: {
        borderRadius: { type: 'all', value: layout.borderRadius },
      },
    },
    text: {
      ...textStyle,
      color: coloring.text,
    },
    placeholder: {
      ...textStyle,
      color: placeholderColor,
    },
    icon: {
      size: iconSizeTokens.size,
      strokeWidth: iconSizeTokens.strokeWidth,
      color: coloring.text,
    },
  }
}
