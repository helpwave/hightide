import { hightideChatConversationListTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatConversationListFooterStyle,
  ChatConversationListHeaderStyle,
  ChatConversationListStyle,
  ChatConversationListTheme
} from '../../types/components/chat'
import { createSimpleStyleResolver } from '../../types/resolver'

export const toConversationListTheme = (themeTokens: ThemeTokens): ChatConversationListTheme => {
  const resolve = () => hightideChatConversationListTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
  })

  return {
    container: createSimpleStyleResolver((): ChatConversationListStyle => ({
      ...resolve().container,
    })),
    header: createSimpleStyleResolver((): ChatConversationListHeaderStyle => ({
      ...resolve().header,
    })),
    footer: createSimpleStyleResolver((): ChatConversationListFooterStyle => ({
      ...resolve().footer,
    })),
  }
}
