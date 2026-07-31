import type { HightideSematicColorSchemes } from './colorScheme'
import type {
  HightideThemeBorderRadiusTokens,
  HightideThemeBorderWidthTokens,
  HightideThemeSpacingTokens
} from '../theme-tokens/layout'
import type {
  HightideSemanticElementLayoutTokens,
  HightideIconThemeTokens
} from './elementLayout'
import type { HightideSemanticColorTokens } from './color'
import type { HightideSemanticElevationShadowTokens } from './shadow'
import type { HightideSemanticTypographyTokens } from './typography'

export type HightideSemanticTokens = {
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideSematicColorSchemes,
  typography: HightideSemanticTypographyTokens,
  spacing: HightideThemeSpacingTokens,
  elementLayout: HightideSemanticElementLayoutTokens,
  icon: HightideIconThemeTokens,
  radius: HightideThemeBorderRadiusTokens,
  border: HightideThemeBorderWidthTokens,
  shadow: HightideSemanticElevationShadowTokens,
}
