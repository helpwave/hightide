import type { HightideColorSchemes } from './colorScheme'
import type {
  HightideThemeBorderRadiusTokens,
  HightideThemeBorderWidthTokens,
  HightideThemeSpacingTokens
} from '../theme-tokens/layout'
import type {
  HightideElementLayoutTokens,
  HightideIconThemeTokens
} from './elementLayout'
import type { HightideSemanticColorTokens } from './color'
import type { HightideElevationShadowTokens } from './shadow'
import type { HightideTypographyTokens } from './typography'

export type HightideSemanticTokens = {
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideColorSchemes,
  typography: HightideTypographyTokens,
  spacing: HightideThemeSpacingTokens,
  elementLayout: HightideElementLayoutTokens,
  icon: HightideIconThemeTokens,
  radius: HightideThemeBorderRadiusTokens,
  border: HightideThemeBorderWidthTokens,
  shadow: HightideElevationShadowTokens,
}
