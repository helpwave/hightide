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
  const resolve = () => componentTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
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
