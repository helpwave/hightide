import type {
  ChatConversationRowPreviewStyle,
  ChatConversationRowState,
  ChatConversationRowStyle,
  ChatConversationRowThemeResolvers,
  ChatConversationRowTimestampStyle,
  ChatConversationRowTitleStyle,
  ChatConversationRowUnreadBadgeStyle,
  ChatConversationRowUnreadBadgeTextStyle,
  ChatMessageBubbleReceiptIconStyle
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

export const toChatConversationRowThemeResolvers: ComponentThemeResolver<ChatConversationRowThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: ChatConversationRowState = {}) => componentTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
    state: {
      isPressed: state.isPressed,
      isDisabled: state.isDisabled,
      isUnread: state.isUnread,
      isSelected: state.isSelected,
    },
  })

  return {
    container: createStyleResolver((state: ChatConversationRowState): ChatConversationRowStyle => ({
      ...resolve(state).container,
    })),
    title: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTitleStyle => ({
      ...resolve(state).title,
    })),
    timestamp: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTimestampStyle => ({
      ...resolve(state).timestamp,
    })),
    preview: createStyleResolver((state: ChatConversationRowState): ChatConversationRowPreviewStyle => ({
      ...resolve(state).preview,
    })),
    unreadBadge: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeStyle => ({
      ...resolve().unreadBadge,
    })),
    unreadBadgeText: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeTextStyle => ({
      ...resolve().unreadBadgeText,
    })),
    sentIndicator: createSimpleValueResolver((): ChatMessageBubbleReceiptIconStyle => ({
      color: resolve().sentIndicator.color,
    })),
  }
}
