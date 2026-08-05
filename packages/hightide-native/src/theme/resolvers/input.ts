import { hightideInputTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { InputState as InputTokenState } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../types/color'
import type {
  InputState,
  InputStyle,
  InputTheme
} from '../types/components/input'
import {
  createSimpleValueResolver,
  createStyleResolver
} from '../types/resolver'

const toTokenState = (state: InputState): InputTokenState => ({
  isDisabled: state.isDisabled,
  isFocused: state.isFocused,
  isInvalid: state.isInvalid,
  isReadOnly: state.isReadOnly,
})

export const toInputTheme = (themeTokens: ThemeTokens): InputTheme => {
  const resolve = (state: InputTokenState) => hightideInputTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    state,
  })

  return {
    input: createStyleResolver((state: InputState): InputStyle => ({
      ...resolve(toTokenState(state)).input,
    })),
    placeholderColor: createSimpleValueResolver((): Color => (
      resolve({}).placeholderColor
    )),
  }
}
