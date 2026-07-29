import type { ColorSchemes } from '../theme/color-scheme'
import type { MotionPrimitiveTokens } from '../primitive/motion'
import type { RadiusPrimitiveTokens } from '../primitive/radius'
import type { SpacingPrimitiveTokens } from '../primitive/spacing'
import type {
  ElementLayoutTokens,
  IconThemeTokens,
  SemanticBorderTokens
} from './element-layout'
import type { SemanticColorTokens } from './color'
import type { ElevationShadowTokens } from './shadow'
import type { TypographyTokens } from './typography'

export type SemanticTokens = {
  colors: SemanticColorTokens,
  colorSchemes: ColorSchemes,
  typography: TypographyTokens,
  spacing: SpacingPrimitiveTokens,
  elementLayout: ElementLayoutTokens,
  icon: IconThemeTokens,
  radius: RadiusPrimitiveTokens,
  border: SemanticBorderTokens,
  shadow: ElevationShadowTokens,
  motion: MotionPrimitiveTokens,
}
