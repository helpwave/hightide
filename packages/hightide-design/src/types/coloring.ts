import type { ColorToken } from './color'

export type ColoringStyleBase = 'outline' | 'solid' | 'tonal' | 'tonal-outline'
export type ColoringStyle = ColoringStyleBase | 'text'

export type ButtonColoringStyle = ColoringStyle

export type ChipColoringStyle = ColoringStyleBase

export type ColoringDefinitionToken = {
  color: ColorToken,
  onColor: ColorToken,
  hover: ColorToken,
  text?: ColorToken,
  textHover?: ColorToken,
  outline?: ColorToken,
  outlineHover?: ColorToken,
  tonalText?: ColorToken,
  tonalBackground?: ColorToken,
}

export type ColoringDefintionTokens = Record<string, ColoringDefinitionToken>
