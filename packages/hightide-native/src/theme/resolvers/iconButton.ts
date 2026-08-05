import { hightideIconButtonTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { IconButtonComponentResolverProps } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
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

const toTokenProps = (state: IconButtonState): IconButtonComponentResolverProps => ({
  overrides: {
    size: state.size,
    color: state.color,
    coloringStyle: state.coloringStyle,
  },
  state: {
    isDisabled: state.isDisabled,
    isHovered: state.isHovered,
    isFocused: state.isFocused,
    isPressed: state.isPressed,
  },
})

export const toIconButtonTheme = (themeTokens: ThemeTokens): IconButtonTheme => {
  const resolve = (state: IconButtonState) => hightideIconButtonTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...toTokenProps(state),
  })

  return {
    button: createStyleResolver((state: IconButtonState): IconButtonStyle => ({
      ...resolve(state).container,
    })),
    icon: createValueResolver((state: IconButtonState): IconButtonIconStyle => ({
      color: resolve(state).icon.color,
    })),
    text: createStyleResolver((state: IconButtonState): IconButtonTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
