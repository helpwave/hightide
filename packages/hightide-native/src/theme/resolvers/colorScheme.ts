import {
  resolveStateBasedProperty,
  type ElementState
} from '@helpwave/hightide-design/theme-tokens'
import type {
  ButtonColoringStyle,
  ChipColoringStyle,
  ColorState,
  HightideColorSchemes,
  ColoringStyle,
  ColoringType
} from '@helpwave/hightide-design/semantic-tokens'

import type { Color } from '../types/color'
import type { InteractionState } from '../types/resolver'

export type ResolvedColoringStyles = {
  backgroundColor: Color,
  color: Color,
  borderColor?: Color,
  borderWidth: number,
}

const interactionStatesToElementStates = (
  state: InteractionState
): ReadonlySet<ElementState> => {
  const states = new Set<ElementState>()

  if (state.isFocused) {
    states.add('focused')
  }
  if (state.isHovered) {
    states.add('hover')
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
  colorSchemes: HightideColorSchemes,
  color: ColoringType,
  coloringStyle: ColoringStyle,
  borderWidth: number,
  state: InteractionState = {}
): ResolvedColoringStyles => {
  const pack = colorSchemes[color][coloringStyle]
  const resolved: ColorState = resolveStateBasedProperty(
    pack,
    interactionStatesToElementStates(state)
  )

  return {
    backgroundColor: resolved.background,
    color: resolved.foreground,
    borderColor: resolved.border,
    borderWidth,
  }
}

export const isOutlineColoringStyle = (
  coloringStyle: ButtonColoringStyle | ChipColoringStyle
): boolean => {
  return coloringStyle === 'outline' || coloringStyle === 'tonal-outline'
}
