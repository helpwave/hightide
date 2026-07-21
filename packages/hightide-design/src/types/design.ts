import type { AnimationTokens } from './animation'
import type { ColorPaletteTokens, SemanticColorTokens } from './color'
import type { ColoringDefintionTokens } from './coloring'
import type { ComponentColorTokens } from './component-colors'
import type { DecorationTokens } from './decoration'
import type { ComponentLayoutTokens } from './layout'
import type { TypographyTokens } from './typography'

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
