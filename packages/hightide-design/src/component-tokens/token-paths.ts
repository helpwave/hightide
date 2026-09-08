import type { ColorToken } from '../primitive-tokens/color'
import type { ShadowToken, ThemeTokens } from '../theme-tokens/theme-tokens'
import type { PrefixedDotPath } from '../utils/path'
import type { PressableButtonTokenParams } from './pressable-button-params'

export type SemanticTokenValues = {
  coloringVariant: {
    color: ColorToken,
    onColor: ColorToken,
    accent: ColorToken,
  },
  coloringStyle: {
    foreground: ColorToken,
    background: ColorToken,
    accent: ColorToken,
  },
  coloring: {
    background: ColorToken,
    foreground: ColorToken,
    border: ColorToken,
    outline: ColorToken,
  },
  stateLayerTint: ColorToken,
}

export type ThemeVariablePath =
  | PrefixedDotPath<ThemeTokens, ColorToken, 'theme'>
  | PrefixedDotPath<ThemeTokens, number, 'theme'>
  | PrefixedDotPath<ThemeTokens, string, 'theme'>
  | PrefixedDotPath<ThemeTokens, ShadowToken, 'theme'>

export type SemanticsColorPath = PrefixedDotPath<SemanticTokenValues, ColorToken, 'semantics'>

export type TokenVariablePath = ThemeVariablePath | SemanticsColorPath

export type PressableButtonParameterPath =
  | PrefixedDotPath<PressableButtonTokenParams, ColorToken, 'params'>
  | PrefixedDotPath<PressableButtonTokenParams, number, 'params'>
  | PrefixedDotPath<PressableButtonTokenParams, string, 'params'>
