import type { ColorValueToken } from '../../primitive-tokens/color-value-token'
import type { HexColor } from '../../utils/hex-color'
import type { NumberValueToken } from '../../primitive-tokens/number-value-token'
import type {
  ColorPairToken,
  ThemeLayoutSize,
  TintStrength
} from '../../theme-tokens/create'
import type { SemanticTokenResolver } from '../types'
import type { HightideThemeTokens } from '../../theme-tokens/hightide'
import type { InputStateValue } from '../../component-tokens/hightide/input-tokens'
import type { PressableStateValue } from '../../component-tokens/hightide/pressable-tokens'
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
  color: ColorValueToken,
  onColor: ColorValueToken,
  accent: ColorValueToken,
}

export type ColoringToken = {
  foreground: ColorValueToken,
  background: ColorValueToken,
  accent: ColorValueToken,
}

export type PressableColoringTokens = {
  background: ColorValueToken,
  foreground: ColorValueToken,
  border: ColorValueToken,
  outline: ColorValueToken,
}

export type InputColoringTokens = {
  background: ColorValueToken,
  text: ColorValueToken,
  border: ColorValueToken,
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
    state: ReadonlySet<PressableStateValue>,
  }, PressableColoringTokens>,
  pressableStateLayerTint: HightideResolver<{
    states: ReadonlySet<PressableStateValue>,
    color: ColorValueToken,
  }, ColorValueToken>,
  inputColoring: HightideResolver<{
    state: ReadonlySet<InputStateValue>,
    color?: ColorPairToken,
  }, InputColoringTokens>,
  controlLayout: HightideResolver<{
    size: ThemeLayoutSize,
  }, ControlElementLayoutToken>,
  touchTargetSize: HightideResolver<object, NumberValueToken>,
  containerLayout: HightideResolver<{
    size: ThemeLayoutSize,
  }, ContainerLayoutToken>,
  insideControlLayout: HightideResolver<{
    size: ThemeLayoutSize,
  }, InsideControlElementLayoutToken>,
  tintedSurface: HightideResolver<{
    tintColor: HexColor,
    tintStrength?: TintStrength,
  }, ColorValueToken>,
  withAppearance: HightideResolver<{
    colorPair: ColorPairToken,
    appearance: Appearance,
  }, ColorValueToken>,
  asFaded: HightideResolver<{
    colorPair: ColorPairToken,
  }, ColorValueToken>,
  asDescription: HightideResolver<{
    colorPair: ColorPairToken,
  }, ColorValueToken>,
}
