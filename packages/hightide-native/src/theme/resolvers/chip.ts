import { hightideChipTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { ChipState as ChipTokenState } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  ChipState,
  ChipStyle,
  ChipTextStyle,
  ChipTheme
} from '../types/components/chip'
import { createStyleResolver } from '../types/resolver'

const toTokenState = (state: ChipState): ChipTokenState => ({
  size: state.size,
  color: state.color,
  coloringStyle: state.coloringStyle,
})

export const toChipTheme = (themeTokens: ThemeTokens): ChipTheme => {
  const resolve = (state: ChipState) => hightideChipTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    state: toTokenState(state),
  })

  return {
    chip: createStyleResolver((state: ChipState): ChipStyle => (
      toContainerStyle(resolve(state).container)
    )),
    text: createStyleResolver((state: ChipState): ChipTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
