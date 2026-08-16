import { toContainerStyle } from '../../adapters/container-adapter'
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
      ...toContainerStyle(resolve().container),
      flex: 1,
    })),
    header: createSimpleStyleResolver((): ChatConversationListHeaderStyle => (
      toContainerStyle(resolve().header)
    )),
    footer: createSimpleStyleResolver((): ChatConversationListFooterStyle => (
      toContainerStyle(resolve().footer)
    )),
  }
}
