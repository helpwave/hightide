import type { BorderPrimitiveTokens } from '../primitive/border'
import type { ElementPrimitiveTokens } from '../primitive/elements'
import type { MotionPrimitiveTokens } from '../primitive/motion'
import type { RadiusPrimitiveTokens } from '../primitive/radius'
import type { SpacingPrimitiveTokens } from '../primitive/spacing'
import type { HightideSemanticColorTokens } from '../semantic/hightide'
import type { ColorSchemes } from './coloring'
import type { ThemeShadowTokens } from './shadow'
import type { ThemeTypographyTokens } from './typography'

export type ThemeColorTokens = HightideSemanticColorTokens

export type ThemeTokens = {
  color: ThemeColorTokens,
  colorSchemes: ColorSchemes,
  spacing: SpacingPrimitiveTokens,
  elements: ElementPrimitiveTokens,
  typography: ThemeTypographyTokens,
  radius: RadiusPrimitiveTokens,
  border: BorderPrimitiveTokens,
  shadow: ThemeShadowTokens,
  motion: MotionPrimitiveTokens,
}
