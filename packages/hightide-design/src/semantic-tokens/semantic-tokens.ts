import { coloringStyleTokens, coloringVariantTokens } from './coloring-style'
import { pressableColoringTokens, pressableStateLayerTintTokens } from './pressable-coloring'

export const semanticTokens = {
  coloringVariant: coloringVariantTokens,
  coloringStyle: coloringStyleTokens,
  coloring: pressableColoringTokens,
  stateLayerTint: pressableStateLayerTintTokens.tint,
} as const

export type SemanticTokens = typeof semanticTokens
