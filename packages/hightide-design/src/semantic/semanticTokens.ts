import type { HightideColorSchemes } from './colorScheme'
import type { HightideRadiusPrimitiveTokens } from '../primitive/radius'
import type { HightideSpacingPrimitiveTokens } from '../primitive/spacing'
import type {
  HightideElementLayoutTokens,
  HightideIconThemeTokens,
  HightideSemanticBorderTokens
} from './elementLayout'
import type { HightideSemanticColorTokens } from './color'
import type { HightideElevationShadowTokens } from './shadow'
import type { HightideTypographyTokens } from './typography'

export type HightideSemanticTokens = {
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideColorSchemes,
  typography: HightideTypographyTokens,
  spacing: HightideSpacingPrimitiveTokens,
  elementLayout: HightideElementLayoutTokens,
  icon: HightideIconThemeTokens,
  radius: HightideRadiusPrimitiveTokens,
  border: HightideSemanticBorderTokens,
  shadow: HightideElevationShadowTokens,
}
