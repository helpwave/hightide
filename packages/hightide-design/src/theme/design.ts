import type { BorderPrimitiveTokens } from '../primitive/border'
import type { BreakpointPrimitiveTokens } from '../primitive/breakpoint'
import type { ColorPalette } from '../primitive/color'
import type { ElementPrimitiveTokens } from '../primitive/elements'
import type { MotionPrimitiveTokens } from '../primitive/motion'
import type { RadiusPrimitiveTokens } from '../primitive/radius'
import type { ShadowPrimitiveTokens } from '../primitive/shadow'
import type { SpacingPrimitiveTokens } from '../primitive/spacing'
import type { SemanticColorTokens } from '../semantic/color'
import type { TypographyTokens } from '../semantic/typography'
import type { ColoringDefintionTokens } from './coloring'
import type { ComponentColorTokens } from './component-colors'

export type DesignTokens = {
  colors: Record<string, ColorPalette>,
  semanticColors: SemanticColorTokens,
  componentColors: ComponentColorTokens,
  coloring: ColoringDefintionTokens,
  typography: TypographyTokens,
  spacing: SpacingPrimitiveTokens,
  elements: ElementPrimitiveTokens,
  breakpoint: BreakpointPrimitiveTokens,
  radius: RadiusPrimitiveTokens,
  border: BorderPrimitiveTokens,
  shadow: ShadowPrimitiveTokens,
  motion: MotionPrimitiveTokens,
}
