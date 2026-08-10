import type { ColorToken, HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type {
  Appearance,
  ColoringColorTokens,
  ColoringColorVariant,
  ColoringStyle,
  ColoringToken,
  ContainerLayoutToken,
  ControlElementLayoutToken,
  InputColoringTokens,
  InsideControlElementLayoutToken,
  PressableColoringTokens,
  PressableVariant
} from '@helpwave/hightide-design/semantic-token-resolvers'
import type { InputState } from '@helpwave/hightide-design/component-token-resolvers'
import type { PressableState } from '@helpwave/hightide-design/component-token-resolvers'
import type {
  ColorPairToken,
  ThemeLayoutSize,
  ThemeTypographySize,
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
    variant: PressableVariant,
    state: ReadonlySet<PressableState>,
  }, PressableColoringTokens>,
  pressableStateLayerTint: BoundSemanticResolver<{
    states: ReadonlySet<PressableState>,
    color: ColorToken,
  }, ColorToken>,
  inputColoring: BoundSemanticResolver<{
    state: InputState,
    color?: ColorPairToken,
  }, InputColoringTokens>,
  controlLayout: BoundSemanticResolver<{
    size: ThemeLayoutSize,
  }, ControlElementLayoutToken>,
  containerLayout: BoundSemanticResolver<{
    size: ThemeLayoutSize,
  }, ContainerLayoutToken>,
  insideControlLayout: BoundSemanticResolver<{
    size: ThemeTypographySize,
  }, InsideControlElementLayoutToken>,
  tintedSurface: BoundSemanticResolver<{
    tintColor: HexColorToken,
    tintStrength?: TintStrength,
  }, HexColorToken>,
  withAppearance: BoundSemanticResolver<{
    color: HexColorToken,
    appearance: Appearance,
  }, HexColorToken>,
  asFaded: BoundSemanticResolver<{
    color: HexColorToken,
  }, HexColorToken>,
  asDescription: BoundSemanticResolver<{
    color: HexColorToken,
  }, HexColorToken>,
}
