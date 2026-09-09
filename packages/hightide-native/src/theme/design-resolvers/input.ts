import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import type { TypographyStyleToken } from '@helpwave/hightide-design/theme-tokens'
import {
  inputTokens,
  type InputStateValue,
  type InputTokenResolver,
  type InputTokens,
  type PressableStateValue
} from '@helpwave/hightide-design/component-tokens'
import type {
  ControlElementLayoutToken,
  InputColoringTokens
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveConfigNode } from '../static-resolve/resolve'
import {
  resolveInputColoring,
  resolvePressableStateLayerTint
} from './semantic'
import { iconTokenResolver } from './icon'

type InputTokenState = InputStateValue | 'hasFocusShadow'

type InputParams = {
  layout: ControlElementLayoutToken,
  coloring: InputColoringTokens,
  tint: ColorToken,
  textStyle: TypographyStyleToken,
  placeholderColor: ColorToken,
  iconSize: number,
  iconStrokeWidth: number,
  outlineColor: ColorToken,
}

export const inputTokenResolver: InputTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const layout = semanticResolvers.controlLayout({
    themeTokens,
    size: 'md',
  })
  const textStyle = themeTokens.typography.body.md
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: {
      size: 'md',
    },
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
  const states = new Set<InputTokenState>(state)

  if (state.has('focused') && coloring.border !== HexColorUtils.transparent) {
    states.add('hasFocusShadow')
  }

  const outlineColor = !state.has('focusVisible')
    ? HexColorUtils.transparent
    : state.has('invalid')
      ? themeTokens.color.negative.color
      : (overrides?.color ?? themeTokens.color.primary).color

  return resolveConfigNode<InputTokens>(
    inputTokens,
    {
      theme: themeTokens,
      params: {
        layout,
        coloring,
        tint,
        textStyle,
        placeholderColor,
        iconSize: iconSizeTokens.size ?? themeTokens.icongraphy.sizes.md,
        iconStrokeWidth: iconSizeTokens.strokeWidth ?? themeTokens.icongraphy.strokeWidth,
        outlineColor,
      } satisfies InputParams,
      state: states,
    }
  )
}
