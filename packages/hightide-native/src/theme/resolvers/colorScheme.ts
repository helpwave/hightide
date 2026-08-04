import { resolveStateBasedProperty } from '@helpwave/hightide-design/theme-tokens'
import type {
  ColorState,
  ColorStateFull,
  ColoringStyle,
  ColoringType,
  ContainerColoringStyle,
  PressableColoringStyle,
  StateBasedProperty
} from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../types/color'
import type { InteractionState } from '../types/resolver'

export type ResolvedColoringStyles = {
  backgroundColor: Color,
  color: Color,
  borderColor?: Color,
}

export type InteractiveColorState = 'disabled' | 'focused' | 'hovered' | 'pressed'

export type InteractiveColorSchemes = Record<
  ColoringType,
  Record<string, StateBasedProperty<InteractiveColorState, ColorState | ColorStateFull>>
>

export const interactionStatesToInteractiveStates = (
  state: InteractionState
): ReadonlySet<InteractiveColorState> => {
  const states = new Set<InteractiveColorState>()

  if (state.isFocused) {
    states.add('focused')
  }
  if (state.isHovered) {
    states.add('hovered')
  }
  if (state.isPressed) {
    states.add('pressed')
  }
  if (state.isDisabled) {
    states.add('disabled')
  }

  return states
}

export const resolveColoringStyles = (
  colorSchemes: InteractiveColorSchemes,
  color: ColoringType,
  coloringStyle: ColoringStyle,
  state: InteractionState = {}
): ResolvedColoringStyles => {
  const pack = colorSchemes[color][coloringStyle]
  const resolved = resolveStateBasedProperty(
    pack,
    interactionStatesToInteractiveStates(state)
  )
  const border = 'border' in resolved ? resolved.border : undefined

  return {
    backgroundColor: resolved.color,
    color: resolved.foreground,
    borderColor: border ?? resolved.color,
  }
}

export const isOutlineColoringStyle = (
  coloringStyle: PressableColoringStyle | ContainerColoringStyle
): boolean => {
  return coloringStyle === 'outline' || coloringStyle === 'tonal-outline'
}
