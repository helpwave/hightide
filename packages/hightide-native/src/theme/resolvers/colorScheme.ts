import { hightideColor } from '@helpwave/hightide-design/primitive'
import {
  resolveStateBasedProperty,
  type ColorState,
  type ElementState
} from '@helpwave/hightide-design/theme'
import type {
  ButtonColoringStyle,
  ChipColoringStyle,
  HightideColorSchemes,
  ColoringStyle,
  ColoringType
} from '@helpwave/hightide-design/semantic'

import type { Color } from '../types/color'
import type { InteractionState } from '../types/resolver'

export type ResolvedColoringStyles = {
  backgroundColor: Color,
  color: Color,
  borderColor?: Color,
  borderWidth: number,
}

const transparent = hightideColor.palettes.transparent.value

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

  const isOutline = coloringStyle === 'outline' || coloringStyle === 'tonal-outline'

  return {
    backgroundColor: resolved.background,
    color: resolved.foreground,
    borderColor: resolved.border === transparent ? undefined : resolved.border,
    borderWidth: isOutline ? borderWidth : 0,
  }
}

export const isOutlineColoringStyle = (
  coloringStyle: ButtonColoringStyle | ChipColoringStyle
): boolean => {
  return coloringStyle === 'outline' || coloringStyle === 'tonal-outline'
}
