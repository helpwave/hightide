import { coloringStyleTokens, coloringVariantTokens } from './coloring-style'
import { pressableColoringTokens } from './pressable-coloring'

export const semanticTokens = {
  coloringVariant: coloringVariantTokens,
  coloringStyle: coloringStyleTokens,
  pressableColoring: pressableColoringTokens,
} as const

export type SemanticTokens = typeof semanticTokens
