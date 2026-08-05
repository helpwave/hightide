import { resolveColorScheme } from './color-scheme'
import { resolveColoringStyle } from './coloring-style'
import { resolveTintedSurface } from './tinted-surface'
import {
  resolveAsDescription,
  resolveAsFaded,
  resolveWithAppearance
} from './with-appearance'
import type { SemanticTokenResolvers } from './types'

export const hightideSemanticTokenResolvers: SemanticTokenResolvers = {
  colorScheme: resolveColorScheme,
  coloringStyle: resolveColoringStyle,
  tintedSurface: resolveTintedSurface,
  withAppearance: resolveWithAppearance,
  asFaded: resolveAsFaded,
  asDescription: resolveAsDescription,
}
