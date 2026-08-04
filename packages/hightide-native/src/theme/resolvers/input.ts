import { hightideInputTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { InputState as InputTokenState } from '@helpwave/hightide-design/component-token-resolvers'
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

export const toInputTheme = (themeTokens: ThemeTokens): InputTheme => ({
  input: createStyleResolver((state: InputState): InputStyle => {
    const { input } = hightideInputTokenResolver({
      themeTokens,
      state: toTokenState(state),
    })

    return { ...input }
  }),
  placeholderColor: createSimpleValueResolver((): Color => (
    hightideInputTokenResolver({ themeTokens, state: {} }).placeholderColor
  )),
})
