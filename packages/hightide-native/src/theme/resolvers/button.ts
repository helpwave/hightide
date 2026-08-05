import { hightideButtonTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { ButtonState as ButtonTokenState } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  ButtonState,
  ButtonStyle,
  ButtonTextStyle,
  ButtonTheme
} from '../types/components/button'
import { createStyleResolver } from '../types/resolver'

const toTokenState = (state: ButtonState): ButtonTokenState => ({
  size: state.size,
  color: state.color,
  coloringStyle: state.coloringStyle,
  isDisabled: state.isDisabled,
  isHovered: state.isHovered,
  isFocused: state.isFocused,
  isPressed: state.isPressed,
})

export const toButtonTheme = (themeTokens: ThemeTokens): ButtonTheme => {
  const resolve = (state: ButtonState) => hightideButtonTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    state: toTokenState(state),
  })

  return {
    container: createStyleResolver((state: ButtonState): ButtonStyle => (
      toContainerStyle(resolve(state).container)
    )),
    text: createStyleResolver((state: ButtonState): ButtonTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
