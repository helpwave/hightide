import { hexWithAlpha, toPx } from '@helpwave/hightide-design/helpers'
import { componentLayouts } from '@helpwave/hightide-design/tokens'
import {
  type ButtonColoringStyle,
  type ChipColoringStyle,
  type ColoringStyle
} from '@helpwave/hightide-design/types'
import type { Color, ColoringDefinition, HightideSemanticColors, InteractionState } from '../types'

export type ResolvedColoringStyles = {
  backgroundColor: Color | 'transparent',
  color: Color,
  borderColor?: Color,
  borderWidth: number,
}

const usesHover = (state: InteractionState): boolean => {
  return !!(state.isHovered || state.isPressed) && !state.isDisabled
}

export const resolveColoringStyles = (
  tokens: ColoringDefinition,
  coloringStyle: ColoringStyle,
  semantic: HightideSemanticColors,
  state: InteractionState = {}
): ResolvedColoringStyles => {
  const outlineWidth = toPx(componentLayouts.shared.coloringOutlineWidth)
  const hovered = usesHover(state)

  if (state.isDisabled) {
    return {
      backgroundColor: semantic.disabled,
      color: semantic.onDisabled,
      borderWidth: 0,
    }
  }

  switch (coloringStyle) {
  case 'solid':
    return {
      backgroundColor: hovered ? tokens.hover : tokens.color,
      color: tokens.onColor,
      borderWidth: 0,
    }
  case 'text':
    return {
      backgroundColor: 'transparent',
      color: hovered
        ? (tokens.textHover ?? tokens.hover)
        : (tokens.text ?? tokens.color),
      borderWidth: 0,
    }
  case 'outline':
    return {
      backgroundColor: 'transparent',
      color: hovered
        ? (tokens.outlineHover ?? tokens.hover)
        : (tokens.outline ?? tokens.color),
      borderColor: hovered
        ? (tokens.outlineHover ?? tokens.hover)
        : (tokens.outline ?? tokens.color),
      borderWidth: outlineWidth,
    }
  case 'tonal':
    return {
      backgroundColor: hexWithAlpha(tokens.tonalBackground ?? tokens.color, hovered ? 0.28 : 0.2),
      color: tokens.tonalText ?? tokens.color,
      borderWidth: 0,
    }
  case 'tonal-outline':
    return {
      backgroundColor: hexWithAlpha(tokens.tonalBackground ?? tokens.color, hovered ? 0.28 : 0.2),
      color: tokens.tonalText ?? tokens.color,
      borderColor: hovered
        ? (tokens.outlineHover ?? tokens.hover)
        : (tokens.outline ?? tokens.color),
      borderWidth: outlineWidth,
    }
  }
}

export const isOutlineColoringStyle = (
  coloringStyle: ButtonColoringStyle | ChipColoringStyle
): boolean => {
  return coloringStyle === 'outline' || coloringStyle === 'tonal-outline'
}
