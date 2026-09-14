import type { ColorToken, ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type {
  Appearance,
  ColoringColorTokens,
  ColoringColorVariant,
  ColoringStyle,
  ColoringToken,
  ContainerLayoutToken,
  ControlElementLayoutToken,
  ElementLayoutTokens,
  InputColoringTokens,
  InsideControlElementLayoutToken,
  PressableColoringTokens,
  ButtonVariant
} from '@helpwave/hightide-design/semantic-tokens'
import type { InputState } from '@helpwave/hightide-design/component-tokens'
import type { PressableState } from '@helpwave/hightide-design/component-tokens'
import type {
  ColorPairToken,
  ThemeLayoutSize,
  TintStrength
} from '@helpwave/hightide-design/theme-tokens'

export type BoundSemanticResolver<TParameter, TResult> = (parameter: TParameter) => TResult

export type HightideThemeSemantics = {
  coloringColorVariant: BoundSemanticResolver<{
    colorPair: ColorPairToken,
    variant: ColoringColorVariant,
  }, ColoringColorTokens>,
  coloringStyle: BoundSemanticResolver<{
    coloring: ColoringColorTokens,
    style: ColoringStyle,
  }, ColoringToken>,
  pressableColoring: BoundSemanticResolver<{
    coloring: ColoringToken,
    variant: ButtonVariant,
    state: PressableState,
  }, PressableColoringTokens>,
  pressableStateLayerTint: BoundSemanticResolver<{
    states: PressableState,
    color: ColorToken,
  }, ColorToken>,
  inputColoring: BoundSemanticResolver<{
    state: InputState,
    color?: ColorPairToken,
  }, InputColoringTokens>,
  controlLayout: BoundSemanticResolver<{
    size: ThemeLayoutSize,
  }, ControlElementLayoutToken>,
  touchTargetSize: BoundSemanticResolver<object, number>,
  containerLayout: BoundSemanticResolver<{
    size: ThemeLayoutSize,
  }, ContainerLayoutToken>,
  insideControlLayout: BoundSemanticResolver<{
    size: ThemeLayoutSize,
  }, InsideControlElementLayoutToken>,
  tintedSurface: BoundSemanticResolver<{
    tintColor: ColorToken,
    tintStrength?: TintStrength,
  }, ColorToken>,
  withAppearance: BoundSemanticResolver<{
    colorPair: ColorPairToken,
    appearance: Appearance,
  }, ColorToken>,
  asFaded: BoundSemanticResolver<{
    colorPair: ColorPairToken,
  }, ColorToken>,
  asDescription: BoundSemanticResolver<{
    colorPair: ColorPairToken,
  }, ColorToken>,
} & ElementLayoutTokens
