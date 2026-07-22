import { createColoringTokensDefinitions } from '../../../helpers/style-resolvers/coloring'
import { animationTokens } from '../../animation'
import { decorationTokens } from '../../decoration'
import { componentLayouts } from '../../layout'
import { typography } from '../../typography/typography'
import type {
  HightideColorPalleteTokens,
  HightideDesignTokens,
  HightideSemanticColorTokens
} from '../../../types'
import type { ComponentColorTokens } from '../../../types/component-colors'

export type ToThemeArgs<PrimitiveTokens, SemanticTokens, ComponentTokens> = {
  themeName: string,
  primitiveTokens: PrimitiveTokens,
  semanticTokens: SemanticTokens,
  componentTokens: ComponentTokens,
}

export const toHightideTheme = ({
  primitiveTokens,
  semanticTokens,
  componentTokens,
}: ToThemeArgs<
  HightideColorPalleteTokens,
  HightideSemanticColorTokens,
  ComponentColorTokens
>): HightideDesignTokens => ({
  colors: primitiveTokens,
  semanticColors: semanticTokens,
  coloring: createColoringTokensDefinitions(semanticTokens),
  componentColors: componentTokens,
  typography,
  animation: animationTokens,
  layout: componentLayouts,
  decorcation: decorationTokens,
})
