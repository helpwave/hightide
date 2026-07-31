import type { HightideSematicColorSchemeTokens } from './colorScheme'
import type {
  HightideThemeBorderRadiusTokens,
  HightideThemeBorderWidthTokens,
  HightideThemeSpacingTokens
} from '../theme-tokens/layout'
import type { HightideSemanticElementLayoutTokens } from './elementLayout'
import type { HightideSemanticColorTokens } from './color'
import type { HightideSemanticShadowTokens } from './shadow'
import type { HightideSemanticTypographyTokens } from './typography'

export type HightideSemanticTokens = {
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideSematicColorSchemeTokens,
  typography: HightideSemanticTypographyTokens,
  spacing: HightideThemeSpacingTokens,
  elementLayout: HightideSemanticElementLayoutTokens,
  borderRadius: HightideThemeBorderRadiusTokens,
  borderWidth: HightideThemeBorderWidthTokens,
  shadow: HightideSemanticShadowTokens,
}
