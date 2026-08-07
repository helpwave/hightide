import type { HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type {
  Appearance,
  ColoringStyle,
  ColoringTokens,
  PressableColoringTokens
} from '@helpwave/hightide-design/semantic-token-resolvers'
import type { PressableState } from '@helpwave/hightide-design/component-token-resolvers'
import type {
  ColorPairToken,
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
