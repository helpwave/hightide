import type { ColorToken } from './color'

export type ColoringStyle = 'outline' | 'solid' | 'text' | 'tonal' | 'tonal-outline'

export type ButtonColoringStyle = ColoringStyle

export type ChipColoringStyle = Omit<ColoringStyle, 'text'>

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
