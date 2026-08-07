import { resolveColoringStyle } from './coloring-style'
import { resolvePressableColoring } from './pressable-coloring'
import { resolveTintedSurface } from './tinted-surface'
import {
  resolveAsDescription,
  resolveAsFaded,
  resolveWithAppearance
} from './with-appearance'
import type { SemanticTokenResolvers } from './types'

export const hightideSemanticTokenResolvers: SemanticTokenResolvers = {
  coloringStyle: resolveColoringStyle,
  pressableColoring: resolvePressableColoring,
  tintedSurface: resolveTintedSurface,
  withAppearance: resolveWithAppearance,
  asFaded: resolveAsFaded,
  asDescription: resolveAsDescription,
}
