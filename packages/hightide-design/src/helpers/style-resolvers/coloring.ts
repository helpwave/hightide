import type {
  ColoringDefinitionToken,
  ColoringDefintionTokens
} from '../../types/coloring'
import type {
  HightideColoringTokens,
  HightideSemanticColorTokens
} from '../../types/hightide'

export const coloringTypes = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const

export type ColoringType = typeof coloringTypes[number]

export const createColoringTokensDefinitions = (semantic: HightideSemanticColorTokens): HightideColoringTokens => ({
  primary: {
    color: semantic.primary,
    onColor: semantic.onPrimary,
    hover: semantic.primaryHover,
  },
  secondary: {
    color: semantic.secondary,
    onColor: semantic.onSecondary,
    hover: semantic.secondaryHover,
  },
  positive: {
    color: semantic.positive,
    onColor: semantic.onPositive,
    hover: semantic.positiveHover,
  },
  warning: {
    color: semantic.warning,
    onColor: semantic.onWarning,
    hover: semantic.warningHover,
  },
  negative: {
    color: semantic.negative,
    onColor: semantic.onNegative,
    hover: semantic.negativeHover,
  },
  neutral: {
    color: semantic.neutral,
    onColor: semantic.onNeutral,
    hover: semantic.neutralHover,
    text: semantic.neutralText,
    textHover: semantic.neutralTextHover,
    outline: semantic.neutralOutline,
    outlineHover: semantic.neutralOutlineHover,
    tonalText: semantic.neutralTonalText,
    tonalBackground: semantic.neutralTonalBackground,
  },
})

export const getColoringToken = (
  color: ColoringType,
  definitions: ColoringDefintionTokens
): ColoringDefinitionToken => definitions[color]
