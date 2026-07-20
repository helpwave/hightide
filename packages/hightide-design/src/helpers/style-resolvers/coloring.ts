import type { ColoringToken, ColoringTokensDefinitions, ColoringType, SemanticColors } from '../../types'

export {
  coloringTypes,
  type ColoringType,
  type ColoringColor,
  type ButtonColoringStyle,
  type ChipColoringStyle,
  type ColoringStyle,
  type ColoringToken,
  type ColoringTokensDefinitions,
  type ColoringTokens,
} from '../../types'

export const coloringColors = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const satisfies readonly ColoringType[]

export const createColoringTokensDefinitions = (semantic: SemanticColors): ColoringTokensDefinitions => ({
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
  definitions: ColoringTokensDefinitions
): ColoringToken => definitions[color]
