import type { ColorToken, HexColorToken } from '../primitive-tokens/color'
import type {
  ColorPairToken,
  ThemeLayoutSize,
  TintStrength
} from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { InputState } from '../component-token-resolvers/input-tokens'
import type { PressableState } from '../component-token-resolvers/pressable-tokens'
import type {
  ContainerLayoutToken,
  ControlElementLayoutToken,
  InsideControlElementLayoutToken
} from './element-layout'
import type { Appearance } from './with-appearance'

export type SemanticTokenResolver<TProps, TResult> = (params: {
  themeTokens: ThemeTokens,
} & TProps) => TResult

export type ColoringColorVariant = 'normal' | 'tonal' | 'transparent'

export type ColoringColorTokens = {
  color: ColorToken,
  onColor: ColorToken,
  accent: ColorToken,
}

export type ColoringToken = {
  foreground: ColorToken,
  background: ColorToken,
  accent: ColorToken,
}

export type PressableColoringTokens = {
  background: ColorToken,
  foreground: ColorToken,
  border: ColorToken,
  outline: ColorToken,
}

export type InputColoringTokens = {
  background: ColorToken,
  text: ColorToken,
  border: ColorToken,
}

export type ColoringStyle = 'filled' | 'foreground'
export type ButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'foreground'
export type IconButtonVariant = Exclude<ButtonVariant, 'outlined'>
export type ChipVariant = 'filled' | 'tonal'

export type { Appearance }

export type SemanticTokenResolvers = {
  coloringColorVariant: SemanticTokenResolver<{
    colorPair: ColorPairToken,
    variant: ColoringColorVariant,
  }, ColoringColorTokens>,
  coloringStyle: SemanticTokenResolver<{
    coloring: ColoringColorTokens,
    style: ColoringStyle,
  }, ColoringToken>,
  pressableColoring: SemanticTokenResolver<{
    coloring: ColoringToken,
    variant: ButtonVariant,
    state: PressableState,
  }, PressableColoringTokens>,
  pressableStateLayerTint: SemanticTokenResolver<{
    states: PressableState,
    color: ColorToken,
  }, ColorToken>,
  inputColoring: SemanticTokenResolver<{
    state: InputState,
    color?: ColorPairToken,
  }, InputColoringTokens>,
  controlLayout: SemanticTokenResolver<{
    size: ThemeLayoutSize,
  }, ControlElementLayoutToken>,
  touchTargetSize: SemanticTokenResolver<object, number>,
  containerLayout: SemanticTokenResolver<{
    size: ThemeLayoutSize,
  }, ContainerLayoutToken>,
  insideControlLayout: SemanticTokenResolver<{
    size: ThemeLayoutSize,
  }, InsideControlElementLayoutToken>,
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
