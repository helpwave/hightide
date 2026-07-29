import type { ThemeTokens } from '../theme/theme-tokens'
import type { ColoringTokens } from '../theme/coloring'
import type { HightideSemanticColorTokens } from './hightide'
import {
  createTypographyTokens,
  type TypographyTokens
} from './typography'
import type { BorderPrimitiveTokens } from '../primitive/border'
import type { BreakpointPrimitiveTokens } from '../primitive/breakpoint'
import type { ElementPrimitiveTokens } from '../primitive/elements'
import type { MotionPrimitiveTokens } from '../primitive/motion'
import type { RadiusPrimitiveTokens } from '../primitive/radius'
import type { ShadowPrimitiveTokens } from '../primitive/shadow'
import type { SpacingPrimitiveTokens } from '../primitive/spacing'

export type SemanticTokens = {
  colors: HightideSemanticColorTokens,
  coloring: ColoringTokens,
  typography: TypographyTokens,
  spacing: SpacingPrimitiveTokens,
  elements: ElementPrimitiveTokens,
  breakpoint: BreakpointPrimitiveTokens,
  radius: RadiusPrimitiveTokens,
  border: BorderPrimitiveTokens,
  shadow: ShadowPrimitiveTokens,
  motion: MotionPrimitiveTokens,
}

export type ToSemanticArgs<Tokens extends ThemeTokens = ThemeTokens> = {
  themeTokens: Tokens,
}

export const toHightideSemanticTokens = ({
  themeTokens,
}: ToSemanticArgs): SemanticTokens => ({
  colors: themeTokens.color,
  coloring: themeTokens.coloring,
  typography: createTypographyTokens(themeTokens.typography),
  spacing: themeTokens.spacing,
  elements: themeTokens.elements,
  breakpoint: themeTokens.breakpoint,
  radius: themeTokens.radius,
  border: themeTokens.border,
  shadow: themeTokens.shadow,
  motion: themeTokens.motion,
})
