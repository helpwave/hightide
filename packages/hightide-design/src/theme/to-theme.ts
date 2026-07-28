import type { BorderPrimitiveTokens } from '../primitive/border'
import type { BreakpointPrimitiveTokens } from '../primitive/breakpoint'
import type { ColorPalette } from '../primitive/color'
import type { ElementPrimitiveTokens } from '../primitive/elements'
import type { MotionPrimitiveTokens } from '../primitive/motion'
import type { PrimitiveTokens } from '../primitive/primitive-tokens'
import type { RadiusPrimitiveTokens } from '../primitive/radius'
import type { ShadowPrimitiveTokens } from '../primitive/shadow'
import type { SpacingPrimitiveTokens } from '../primitive/spacing'
import type { HightideSemanticColorTokens } from '../semantic/hightide'
import { typography } from '../semantic/typography'
import type { TypographyTokens } from '../semantic/typography'
import type { ColoringDefinitionToken } from './coloring'
import type { ComponentColorTokens } from './component-colors'

export type HightideColoringTokens = {
  primary: ColoringDefinitionToken,
  secondary: ColoringDefinitionToken,
  positive: ColoringDefinitionToken,
  warning: ColoringDefinitionToken,
  negative: ColoringDefinitionToken,
  neutral: ColoringDefinitionToken,
}

export type HightideThemeTokens = {
  colors: Record<string, ColorPalette>,
  semanticColors: HightideSemanticColorTokens,
  componentColors: ComponentColorTokens,
  coloring: HightideColoringTokens,
  typography: TypographyTokens,
  spacing: SpacingPrimitiveTokens,
  elements: ElementPrimitiveTokens,
  breakpoint: BreakpointPrimitiveTokens,
  radius: RadiusPrimitiveTokens,
  border: BorderPrimitiveTokens,
  shadow: ShadowPrimitiveTokens,
  motion: MotionPrimitiveTokens,
}

export type ToThemeArgs<
  Tokens extends PrimitiveTokens = PrimitiveTokens,
  SemanticTokens = HightideSemanticColorTokens,
  ComponentTokens = ComponentColorTokens
> = {
  themeName: string,
  primitiveTokens: Tokens,
  semanticTokens: SemanticTokens,
  componentTokens: ComponentTokens,
}

const createColoringTokensDefinitions = (
  semantic: HightideSemanticColorTokens
): HightideColoringTokens => ({
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

export const toHightideTheme = ({
  primitiveTokens,
  semanticTokens,
  componentTokens,
}: ToThemeArgs): HightideThemeTokens => ({
  colors: primitiveTokens.color.palettes,
  semanticColors: semanticTokens,
  coloring: createColoringTokensDefinitions(semanticTokens),
  componentColors: componentTokens,
  typography,
  spacing: primitiveTokens.spacing,
  elements: primitiveTokens.elements,
  breakpoint: primitiveTokens.breakpoint,
  radius: primitiveTokens.radius,
  border: primitiveTokens.border,
  shadow: primitiveTokens.shadow,
  motion: primitiveTokens.motion,
})
