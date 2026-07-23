import { animationTokens } from '../animation'
import { decorationTokens } from '../decoration'
import { componentLayouts } from '../layout'
import { typography } from '../typography/typography'
import type {
  HightideColoringTokens,
  HightideColorPalleteTokens,
  HightideThemeTokens,
  HightideSemanticColorTokens
} from '../../types/hightide'
import type { ComponentColorTokens } from '../../types/component-colors'

export type ToThemeArgs<PrimitiveTokens, SemanticTokens, ComponentTokens> = {
  themeName: string,
  primitiveTokens: PrimitiveTokens,
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
}: ToThemeArgs<
  HightideColorPalleteTokens,
  HightideSemanticColorTokens,
  ComponentColorTokens
>): HightideThemeTokens => ({
  colors: primitiveTokens,
  semanticColors: semanticTokens,
  coloring: createColoringTokensDefinitions(semanticTokens),
  componentColors: componentTokens,
  typography,
  animation: animationTokens,
  layout: componentLayouts,
  decorcation: decorationTokens,
})
