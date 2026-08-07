import type { HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type {
  Appearance,
  ColoringStyle,
  ColoringTokens,
  ContainerLayoutToken,
  ControlElementLayoutToken,
  InputColoringTokens,
  InsideControlElementLayoutToken,
  PressableColoringTokens
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
  coloringStyle: BoundSemanticResolver<{
    colorPair: ColorPairToken,
    style: ColoringStyle,
  }, ColoringTokens>,
  pressableColoring: BoundSemanticResolver<{
    coloring: ColoringTokens,
    style: ColoringStyle,
    state: ReadonlySet<PressableState>,
  }, PressableColoringTokens>,
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
