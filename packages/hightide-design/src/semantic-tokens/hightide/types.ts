import type { ColorToken } from '../../primitive-tokens/color-token'
import type { HexColor } from '../../utils/hex-color'
import type { NumberToken } from '../../primitive-tokens/number-token'
import type {
  ColorPairToken,
  ThemeLayoutSize,
  TintStrength
} from '../../theme-tokens/create'
import type { SemanticTokenResolver } from '../types'
import type { HightideThemeTokens } from '../../theme-tokens/hightide'
import type { InputState } from '../../component-tokens/input-tokens'
import type { PressableState } from '../../component-tokens/pressable-tokens'
import type {
  ComponentSize,
  ContainerLayoutToken,
  ControlElementLayoutToken,
  InsideControlElementLayoutToken
} from './element-layout'
import type { Appearance } from './with-appearance'

type HightideResolver<TProps, TResult> =
  SemanticTokenResolver<TProps, TResult, HightideThemeTokens>

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

export type SemanticColoringConfig = {
  coloringColorVariant: ColoringColorVariant,
  coloringStyle: ColoringStyle,
}

export type ButtonTokenConfig = {
  size: ComponentSize,
  variant: ButtonVariant,
}

export type PressableTokenConfig = {
  size: ComponentSize,
  coloringColorVariant: ColoringColorVariant,
  coloringStyle: ColoringStyle,
}

export type PressableButtonColoringConfig = {
  variant: ButtonVariant,
  coloringColorVariant: ColoringColorVariant,
  coloringStyle: ColoringStyle,
}

export type { Appearance }

export type SemanticTokenResolvers = {
  coloringColorVariant: HightideResolver<{
    colorPair: ColorPairToken,
    variant: ColoringColorVariant,
  }, ColoringColorTokens>,
  coloringStyle: HightideResolver<{
    coloring: ColoringColorTokens,
    style: ColoringStyle,
  }, ColoringToken>,
  pressableColoring: HightideResolver<{
    coloring: ColoringToken,
    variant: ButtonVariant,
    state: PressableState,
  }, PressableColoringTokens>,
  pressableStateLayerTint: HightideResolver<{
    states: PressableState,
    color: ColorToken,
  }, ColorToken>,
  inputColoring: HightideResolver<{
    state: InputState,
    color?: ColorPairToken,
  }, InputColoringTokens>,
  controlLayout: HightideResolver<{
    size: ThemeLayoutSize,
  }, ControlElementLayoutToken>,
  touchTargetSize: HightideResolver<object, NumberToken>,
  containerLayout: HightideResolver<{
    size: ThemeLayoutSize,
  }, ContainerLayoutToken>,
  insideControlLayout: HightideResolver<{
    size: ThemeLayoutSize,
  }, InsideControlElementLayoutToken>,
  tintedSurface: HightideResolver<{
    tintColor: HexColor,
    tintStrength?: TintStrength,
  }, ColorToken>,
  withAppearance: HightideResolver<{
    colorPair: ColorPairToken,
    appearance: Appearance,
  }, ColorToken>,
  asFaded: HightideResolver<{
    colorPair: ColorPairToken,
  }, ColorToken>,
  asDescription: HightideResolver<{
    colorPair: ColorPairToken,
  }, ColorToken>,
}
