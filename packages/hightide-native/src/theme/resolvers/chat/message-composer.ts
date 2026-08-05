import { hightideChatMessageComposerTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../../types/color'
import type {
  ChatMessageComposerInputStyle,
  ChatMessageComposerStyle,
  ChatMessageComposerTheme
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver
} from '../../types/resolver'

export const toMessageComposerTheme = (themeTokens: ThemeTokens): ChatMessageComposerTheme => {
  const resolve = () => hightideChatMessageComposerTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
  })

  return {
    container: createSimpleStyleResolver((): ChatMessageComposerStyle => ({
      ...resolve().container,
    })),
    input: createSimpleStyleResolver((): ChatMessageComposerInputStyle => ({
      ...resolve().input,
    })),
    placeholderColor: createSimpleValueResolver((): Color => (
      resolve().placeholderColor
    )),
  }
}
