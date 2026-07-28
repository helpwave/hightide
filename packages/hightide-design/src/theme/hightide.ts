import type { AnimationTokens } from '../primitive/animation'
import type { HightideColorPalleteTokens, HightideDecorationTokens } from '../primitive/hightide'
import type { ComponentLayoutTokens } from '../primitive/layout'
import type { HightideSemanticColorTokens } from '../semantic/hightide'
import type { TypographyTokens } from '../semantic/typography'
import type { ColoringDefinitionToken } from './coloring'
import type { ComponentColorTokens } from './component-colors'
import type { DesignTokens } from './design'

export type HightideColoringTokens = {
  primary: ColoringDefinitionToken,
  secondary: ColoringDefinitionToken,
  positive: ColoringDefinitionToken,
  warning: ColoringDefinitionToken,
  negative: ColoringDefinitionToken,
  neutral: ColoringDefinitionToken,
}

export type HightideThemeTokens = {
  colors: HightideColorPalleteTokens & DesignTokens['colors'],
  semanticColors: HightideSemanticColorTokens & DesignTokens['semanticColors'],
  componentColors: ComponentColorTokens & DesignTokens['componentColors'],
  coloring: HightideColoringTokens & DesignTokens['coloring'],
  typography: TypographyTokens & DesignTokens['typography'],
  layout: ComponentLayoutTokens & DesignTokens['layout'],
  animation: AnimationTokens & DesignTokens['animation'],
  decorcation: HightideDecorationTokens & DesignTokens['decorcation'],
}
