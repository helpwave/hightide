import { resolveColoringStyle } from './coloring-style'
import {
  resolveContainerLayout,
  resolveControlLayout,
  resolveInsideControlLayout
} from './element-layout'
import { resolveInputColoring } from './input-coloring'
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
  inputColoring: resolveInputColoring,
  controlLayout: resolveControlLayout,
  containerLayout: resolveContainerLayout,
  insideControlLayout: resolveInsideControlLayout,
  tintedSurface: resolveTintedSurface,
  withAppearance: resolveWithAppearance,
  asFaded: resolveAsFaded,
  asDescription: resolveAsDescription,
}
