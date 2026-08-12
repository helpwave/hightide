import {
  resolveColoringColorVariant,
  resolveColoringStyle
} from './coloring-style'
import {
  resolveContainerLayout,
  resolveControlLayout,
  resolveInsideControlLayout,
  resolveTouchTargetSize
} from './element-layout'
import { resolveInputColoring } from './input-coloring'
import {
  resolvePressableColoring,
  resolvePressableStateLayerTint
} from './pressable-coloring'
import { resolveTintedSurface } from './tinted-surface'
import {
  resolveAsDescription,
  resolveAsFaded,
  resolveWithAppearance
} from './with-appearance'
import type { SemanticTokenResolvers } from './types'

export const hightideSemanticTokenResolvers: SemanticTokenResolvers = {
  coloringColorVariant: resolveColoringColorVariant,
  coloringStyle: resolveColoringStyle,
  pressableColoring: resolvePressableColoring,
  pressableStateLayerTint: resolvePressableStateLayerTint,
  inputColoring: resolveInputColoring,
  controlLayout: resolveControlLayout,
  touchTargetSize: resolveTouchTargetSize,
  containerLayout: resolveContainerLayout,
  insideControlLayout: resolveInsideControlLayout,
  tintedSurface: resolveTintedSurface,
  withAppearance: resolveWithAppearance,
  asFaded: resolveAsFaded,
  asDescription: resolveAsDescription,
}
