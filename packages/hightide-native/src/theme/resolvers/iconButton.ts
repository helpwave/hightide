import { hightideIconButtonTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { IconButtonState as IconButtonTokenState } from '@helpwave/hightide-design/component-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toTextStyle } from '../adapters/style-adapters'
import type {
  IconButtonIconStyle,
  IconButtonState,
  IconButtonStyle,
  IconButtonTextStyle,
  IconButtonTheme
} from '../types/components/iconButton'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

const toTokenState = (state: IconButtonState): IconButtonTokenState => ({
  size: state.size,
  color: state.color,
  coloringStyle: state.coloringStyle,
  isDisabled: state.isDisabled,
  isHovered: state.isHovered,
  isFocused: state.isFocused,
  isPressed: state.isPressed,
})

export const toIconButtonTheme = (themeTokens: ThemeTokens): IconButtonTheme => ({
  button: createStyleResolver((state: IconButtonState): IconButtonStyle => {
    const { container } = hightideIconButtonTokenResolver({
      themeTokens,
      state: toTokenState(state),
    })

    return { ...container }
  }),
  icon: createValueResolver((state: IconButtonState): IconButtonIconStyle => {
    const { icon } = hightideIconButtonTokenResolver({
      themeTokens,
      state: toTokenState(state),
    })

    return { color: icon.color }
  }),
  text: createStyleResolver((state: IconButtonState): IconButtonTextStyle => (
    toTextStyle(hightideIconButtonTokenResolver({
      themeTokens,
      state: toTokenState(state),
    }).text)
  )),
})
