import { hightideChatSystemLineTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ColorPairToken, ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatSystemLineIconStyle,
  ChatSystemLineState,
  ChatSystemLineStyle,
  ChatSystemLineTextStyle,
  ChatSystemLineTheme
} from '../../types/components/chat'
import {
  createStyleResolver,
  createValueResolver
} from '../../types/resolver'

export const toSystemLineTheme = (themeTokens: ThemeTokens): ChatSystemLineTheme => {
  const resolve = (color?: ColorPairToken) => hightideChatSystemLineTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    overrides: { color },
  })

  return {
    container: createStyleResolver((state: ChatSystemLineState): ChatSystemLineStyle => ({
      ...resolve(state.color).container,
    })),
    text: createStyleResolver((state: ChatSystemLineState): ChatSystemLineTextStyle => ({
      ...resolve(state.color).text,
    })),
    icon: createValueResolver((state: ChatSystemLineState): ChatSystemLineIconStyle => ({
      color: resolve(state.color).icon.color,
    })),
  }
}
