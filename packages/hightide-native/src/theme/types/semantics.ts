import type { HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type {
  Appearance,
  ColorSchemeToken,
  ColoringStyle,
  ColoringTokens
} from '@helpwave/hightide-design/semantic-token-resolvers'
import type { PressableState } from '@helpwave/hightide-design/component-token-resolvers'
import type {
  ColorPairToken,
  TintStrength
} from '@helpwave/hightide-design/theme-tokens'

export type BoundSemanticResolver<TParameter, TResult> = (parameter: TParameter) => TResult

export type HightideThemeSemantics = {
  colorScheme: BoundSemanticResolver<{ colorPair: ColorPairToken }, ColorSchemeToken>,
  coloringStyle: BoundSemanticResolver<{
    colorScheme: ColorSchemeToken,
    style: ColoringStyle,
    state: ReadonlySet<PressableState>,
  }, ColoringTokens>,
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
