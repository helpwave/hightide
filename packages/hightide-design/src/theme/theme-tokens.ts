import type { BorderPrimitiveTokens } from '../primitive/border'
import type { BreakpointPrimitiveTokens } from '../primitive/breakpoint'
import type { ElementPrimitiveTokens } from '../primitive/elements'
import type { MotionPrimitiveTokens } from '../primitive/motion'
import type { RadiusPrimitiveTokens } from '../primitive/radius'
import type { ShadowPrimitiveTokens } from '../primitive/shadow'
import type { SpacingPrimitiveTokens } from '../primitive/spacing'
import type { HightideSemanticColorTokens } from '../semantic/hightide'
import type { ColoringTokens } from './coloring'
import type { ThemeTypographyTokens } from './typography'

export type ThemeColorTokens = HightideSemanticColorTokens

export type ThemeTokens = {
  color: ThemeColorTokens,
  coloring: ColoringTokens,
  spacing: SpacingPrimitiveTokens,
  elements: ElementPrimitiveTokens,
  typography: ThemeTypographyTokens,
  radius: RadiusPrimitiveTokens,
  border: BorderPrimitiveTokens,
  shadow: ShadowPrimitiveTokens,
  motion: MotionPrimitiveTokens,
  breakpoint: BreakpointPrimitiveTokens,
}
