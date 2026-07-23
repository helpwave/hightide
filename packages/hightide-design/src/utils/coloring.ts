import type {
  ColoringDefinitionToken,
  ColoringDefintionTokens
} from '../types/coloring'

export const coloringTypes = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const

export type ColoringType = typeof coloringTypes[number]

export const getColoringToken = (
  color: ColoringType,
  definitions: ColoringDefintionTokens
): ColoringDefinitionToken => definitions[color]
