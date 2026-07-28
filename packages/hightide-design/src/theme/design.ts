import type { AnimationTokens } from '../primitive/animation'
import type { ColorPaletteTokens } from '../primitive/color'
import type { DecorationTokens } from '../primitive/decoration'
import type { ComponentLayoutTokens } from '../primitive/layout'
import type { SemanticColorTokens } from '../semantic/color'
import type { TypographyTokens } from '../semantic/typography'
import type { ColoringDefintionTokens } from './coloring'
import type { ComponentColorTokens } from './component-colors'

export type DesignTokens = {
  colors: ColorPaletteTokens,
  semanticColors: SemanticColorTokens,
  componentColors: ComponentColorTokens,
  coloring: ColoringDefintionTokens,
  typography: TypographyTokens,
  layout: ComponentLayoutTokens,
  animation: AnimationTokens,
  decorcation: DecorationTokens,
}
