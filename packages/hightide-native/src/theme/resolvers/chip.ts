import { hightideChipTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { ChipComponentResolverProps } from '@helpwave/hightide-design/component-token-resolvers'
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

const toTokenProps = (state: ChipState): ChipComponentResolverProps => ({
  overrides: {
    size: state.size,
    color: state.color,
    coloringStyle: state.coloringStyle,
  },
})

export const toChipTheme = (themeTokens: ThemeTokens): ChipTheme => {
  const resolve = (state: ChipState) => hightideChipTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...toTokenProps(state),
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
