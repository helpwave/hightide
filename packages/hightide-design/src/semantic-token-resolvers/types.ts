import type { ColorToken, HexColorToken } from '../primitive-tokens/color'
import type { ColorPairToken, TintStrength } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { PressableState } from '../component-token-resolvers/pressable'
import type { Appearance } from './with-appearance'

export type SemanticTokenResolver<TProps, TResult> = (params: {
  themeTokens: ThemeTokens,
} & TProps) => TResult

export type ColoringTokens = {
  background: ColorToken,
  text: ColorToken,
  accent: ColorToken,
}

export type PressableColoringTokens = {
  background: ColorToken,
  text: ColorToken,
  border: ColorToken,
  outline: ColorToken,
}

export type ColoringStyleBase = 'outline' | 'filled' | 'tonal' | 'tonal-outline'
export type ColoringStyle = ColoringStyleBase | 'text'
export type PressableColoringStyle = ColoringStyle
export type ContainerColoringStyle = ColoringStyleBase
export type ChipColoringStyle = ContainerColoringStyle

export type { Appearance }

export type SemanticTokenResolvers = {
  coloringStyle: SemanticTokenResolver<{
    colorPair: ColorPairToken,
    style: ColoringStyle,
  }, ColoringTokens>,
  pressableColoring: SemanticTokenResolver<{
    coloring: ColoringTokens,
    style: ColoringStyle,
    state: ReadonlySet<PressableState>,
  }, PressableColoringTokens>,
  tintedSurface: SemanticTokenResolver<{
    tintColor: HexColorToken,
    tintStrength?: TintStrength,
  }, HexColorToken>,
  withAppearance: SemanticTokenResolver<{
    color: HexColorToken,
    appearance: Appearance,
  }, HexColorToken>,
  asFaded: SemanticTokenResolver<{
    color: HexColorToken,
  }, HexColorToken>,
  asDescription: SemanticTokenResolver<{
    color: HexColorToken,
  }, HexColorToken>,
}
