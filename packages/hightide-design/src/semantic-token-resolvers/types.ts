import type { ColorToken, HexColorToken } from '../primitive-tokens/color'
import type { ColorPairToken, TintStrength } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { PressableState } from '../component-token-resolvers/pressable'
import type { Appearance } from './with-appearance'

export type SemanticTokenResolver<TProps, TResult> = (params: {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
} & TProps) => TResult

export type ColorSchemeToken = {
  color: ColorToken,
  onColor: ColorToken,
  feedback: {
    subtle: ColorToken,
    onSubtle?: ColorToken,
    normal: ColorToken,
    onNormal?: ColorToken,
    strong: ColorToken,
    onStrong?: ColorToken,
  },
}

export type ColoringTokens = {
  color: ColorToken,
  onColor: ColorToken,
  borderColor?: ColorToken,
  outlineColor?: ColorToken,
}

export type ColoringStyleBase = 'outline' | 'filled' | 'tonal' | 'tonal-outline'
export type ColoringStyle = ColoringStyleBase | 'text'
export type PressableColoringStyle = ColoringStyle
export type ContainerColoringStyle = ColoringStyleBase
export type ChipColoringStyle = ContainerColoringStyle

export type { Appearance }

export type SemanticTokenResolvers = {
  colorScheme: SemanticTokenResolver<{ colorPair: ColorPairToken }, ColorSchemeToken>,
  coloringStyle: SemanticTokenResolver<{
    colorScheme: ColorSchemeToken,
    style: ColoringStyle,
    state: ReadonlySet<PressableState>,
  }, ColoringTokens>,
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
