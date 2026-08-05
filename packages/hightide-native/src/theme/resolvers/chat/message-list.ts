import { hightideChatMessageListTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatMessageListStyle,
  ChatMessageListTheme
} from '../../types/components/chat'
import { createSimpleStyleResolver } from '../../types/resolver'

export const toMessageListTheme = (themeTokens: ThemeTokens): ChatMessageListTheme => {
  const resolve = () => hightideChatMessageListTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
  })

  return {
    container: createSimpleStyleResolver((): ChatMessageListStyle => ({
      ...resolve().container,
    })),
  }
}
