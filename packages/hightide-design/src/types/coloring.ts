import type { ColorValue } from './color'

export const coloringTypes = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const

export type ColoringType = typeof coloringTypes[number]

/** @deprecated Use ColoringType */
export type ColoringColor = ColoringType

export type ButtonColoringStyle = 'outline' | 'solid' | 'text' | 'tonal' | 'tonal-outline'

export type ChipColoringStyle = 'solid' | 'tonal' | 'outline' | 'tonal-outline'

export type ColoringStyle = ButtonColoringStyle

export type ColoringToken = {
  color: ColorValue,
  onColor: ColorValue,
  hover: ColorValue,
  text?: ColorValue,
  textHover?: ColorValue,
  outline?: ColorValue,
  outlineHover?: ColorValue,
  tonalText?: ColorValue,
  tonalBackground?: ColorValue,
}

export type ColoringTokensDefinitions = Record<ColoringType, ColoringToken>

/** @deprecated Use ColoringToken */
export type ColoringTokens = ColoringToken
