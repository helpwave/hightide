import { coloringStyleTokens, coloringVariantTokens } from './coloring-style'
import { pressableColoringTokens, pressableStateLayerTintTokens } from './pressable-coloring'
import { inputColoringTokens } from './input-coloring'
import {
  containerLayoutTokens,
  controlLayoutTokens,
  insideControlLayoutTokens,
  touchTargetSizeTokens
} from './element-layout'
import { withAppearanceTokens } from './with-appearance'
import { tintedSurfaceTokens } from './tinted-surface'
import type { AssertAssignable } from '../../utils/assert'
import type { HightideResolverConfig, HightideResolverParams } from '../../primitive-tokens/resolver-types'
import type { ColorValueToken } from '../../primitive-tokens/color-value-token'
import type { NumberValueToken } from '../../primitive-tokens/number-value-token'
import type { TokenRefOrValue } from '../../utils/token-type'
import type { ContextBasedProperty } from '../../component-tokens/context-based'
import type { HightideThemeTokens } from '../../theme-tokens/hightide'
import type { SemanticTokens } from '../semantic-tokens'

export type HightideSemanticPathProvider = {
  theme: HightideThemeTokens,
  semantics: HightideSemanticTokens,
  params: HightideResolverParams,
}

type SemanticColorProperty = ContextBasedProperty<
  TokenRefOrValue<ColorValueToken>,
  HightideResolverConfig
>

type SemanticNumberProperty = ContextBasedProperty<
  TokenRefOrValue<NumberValueToken>,
  HightideResolverConfig
>

export type HightideSemanticTokens = AssertAssignable<{
  color: {
    coloringVariant: {
      color: SemanticColorProperty,
      onColor: SemanticColorProperty,
      accent: SemanticColorProperty,
    },
    coloringStyle: {
      foreground: SemanticColorProperty,
      background: SemanticColorProperty,
      accent: SemanticColorProperty,
    },
    coloring: {
      background: SemanticColorProperty,
      foreground: SemanticColorProperty,
      border: SemanticColorProperty,
      outline: SemanticColorProperty,
    },
    stateLayerTint: SemanticColorProperty,
    inputColoring: {
      background: SemanticColorProperty,
      text: SemanticColorProperty,
      border: SemanticColorProperty,
    },
    withAppearance: {
      normal: SemanticColorProperty,
      subtle: SemanticColorProperty,
      faded: SemanticColorProperty,
    },
    tintedSurface: {
      light: SemanticColorProperty,
      normal: SemanticColorProperty,
      strong: SemanticColorProperty,
    },
  },
  number: {
    controlLayout: {
      size: SemanticNumberProperty,
      inset: SemanticNumberProperty,
      borderWidth: SemanticNumberProperty,
      borderRadius: SemanticNumberProperty,
      horizontalContentPadding: SemanticNumberProperty,
    },
    containerLayout: {
      size: SemanticNumberProperty,
      insetY: SemanticNumberProperty,
      insetX: SemanticNumberProperty,
      borderRadius: SemanticNumberProperty,
      minimumWidth: SemanticNumberProperty,
      minimumHeight: SemanticNumberProperty,
    },
    insideControlLayout: {
      size: SemanticNumberProperty,
      inset: SemanticNumberProperty,
      borderWidth: SemanticNumberProperty,
      borderRadius: SemanticNumberProperty,
      paddingExtension: SemanticNumberProperty,
    },
    touchTargetSize: SemanticNumberProperty,
  },
}, SemanticTokens<HightideResolverConfig>>

export const semanticTokens: HightideSemanticTokens = {
  color: {
    coloringVariant: coloringVariantTokens,
    coloringStyle: coloringStyleTokens,
    coloring: pressableColoringTokens,
    stateLayerTint: pressableStateLayerTintTokens.tint,
    inputColoring: inputColoringTokens,
    withAppearance: withAppearanceTokens,
    tintedSurface: tintedSurfaceTokens,
  },
  number: {
    controlLayout: controlLayoutTokens,
    containerLayout: containerLayoutTokens,
    insideControlLayout: insideControlLayoutTokens,
    touchTargetSize: touchTargetSizeTokens,
  },
}
