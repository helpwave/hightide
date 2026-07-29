import type { ThemeTokens } from '../theme/theme-tokens'
import type { BorderTokens } from '../theme/border'
import type { ColorSchemes } from '../theme/color-scheme'
import {
  type HightideSemanticColorTokens
} from './hightide'
import {
  toHightideElevationShadow,
  type ElevationShadowTokens
} from './shadow'
import {
  createTypographyTokens,
  type TypographyTokens
} from './typography'
import type { ElementPrimitiveTokens } from '../primitive/elements'
import type { MotionPrimitiveTokens } from '../primitive/motion'
import type { RadiusPrimitiveTokens } from '../primitive/radius'
import type { SpacingPrimitiveTokens } from '../primitive/spacing'

export type SemanticTokens = {
  colors: HightideSemanticColorTokens,
  colorSchemes: ColorSchemes,
  typography: TypographyTokens,
  spacing: SpacingPrimitiveTokens,
  elements: ElementPrimitiveTokens,
  radius: RadiusPrimitiveTokens,
  border: BorderTokens,
  shadow: ElevationShadowTokens,
  motion: MotionPrimitiveTokens,
}

export type ToSemanticArgs<Tokens extends ThemeTokens = ThemeTokens> = {
  themeTokens: Tokens,
}

const toSemanticColors = (themeColors: ThemeTokens['color']): HightideSemanticColorTokens => {
  return { ...themeColors }
}

export const toHightideSemanticTokens = ({
  themeTokens,
}: ToSemanticArgs): SemanticTokens => ({
  colors: toSemanticColors(themeTokens.color),
  colorSchemes: themeTokens.colorSchemes,
  typography: createTypographyTokens(themeTokens.typography),
  spacing: themeTokens.spacing,
  elements: themeTokens.elements,
  radius: themeTokens.radius,
  border: themeTokens.border,
  shadow: toHightideElevationShadow(themeTokens.shadow),
  motion: themeTokens.motion,
})
