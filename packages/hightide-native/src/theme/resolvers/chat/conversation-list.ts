import type {
  ChatConversationListFooterStyle,
  ChatConversationListHeaderStyle,
  ChatConversationListStyle,
  ChatConversationListThemeResolvers
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

import { StyleAdapterUtils } from '../../adapters'

export const toChatConversationListThemeResolvers: ComponentThemeResolver<ChatConversationListThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = () => componentTokens.chat.conversationList({
    themeTokens,
    semanticResolvers: semanticTokens
  })

  return {
    container: createSimpleStyleResolver((): ChatConversationListStyle => ({
      ...StyleAdapterUtils.container(resolve().container),
      flex: 1,
    })),
    header: createSimpleStyleResolver((): ChatConversationListHeaderStyle => (
      StyleAdapterUtils.container(resolve().header)
    )),
    footer: createSimpleStyleResolver((): ChatConversationListFooterStyle => (
      StyleAdapterUtils.container(resolve().footer)
    )),
  }
}
