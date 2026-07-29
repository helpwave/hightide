import type { ElementPrimitiveTokens } from '../primitive/elements'
import type { MotionPrimitiveTokens } from '../primitive/motion'
import type { RadiusPrimitiveTokens } from '../primitive/radius'
import type { SpacingPrimitiveTokens } from '../primitive/spacing'
import type {
  HightideSemanticColorTokens,
  ThemeRoleColorTokens
} from '../semantic/hightide'
import type { BorderTokens } from './border'
import type { ColorSchemes } from './color-scheme'
import type { ThemeShadowTokens } from './shadow'
import type { ThemeTypographyTokens } from './typography'

export type ThemeColorTokens = HightideSemanticColorTokens & ThemeRoleColorTokens

export type ThemeTokens = {
  color: ThemeColorTokens,
  colorSchemes: ColorSchemes,
  spacing: SpacingPrimitiveTokens,
  elements: ElementPrimitiveTokens,
  typography: ThemeTypographyTokens,
  radius: RadiusPrimitiveTokens,
  border: BorderTokens,
  shadow: ThemeShadowTokens,
  motion: MotionPrimitiveTokens,
}
