import { hightideInputTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { InputComponentResolverProps } from '@helpwave/hightide-design/component-token-resolvers'
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

const emptyProps = (): InputComponentResolverProps => ({
  state: {},
})

const toTokenProps = (state: InputState): InputComponentResolverProps => ({
  state: {
    isDisabled: state.isDisabled,
    isFocused: state.isFocused,
    isInvalid: state.isInvalid,
    isReadOnly: state.isReadOnly,
  },
})

export const toInputTheme = (themeTokens: ThemeTokens): InputTheme => {
  const resolve = (props: InputComponentResolverProps) => hightideInputTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...props,
  })

  return {
    input: createStyleResolver((state: InputState): InputStyle => ({
      ...resolve(toTokenProps(state)).input,
    })),
    placeholderColor: createSimpleValueResolver((): Color => (
      resolve(emptyProps()).placeholderColor
    )),
  }
}
