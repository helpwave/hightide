import { toContainerStyle, toTextStyle } from '../../adapters/style-adapters'
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
  const resolve = (state: ChatConversationRowState = {}) => componentTokens.chat.conversationRow({
    themeTokens,
    semanticResolvers: semanticTokens,
    state: {
      isPressed: state.isPressed,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isFocusVisible: state.isFocusVisible,
      isDisabled: state.isDisabled,
      isUnread: state.isUnread,
      isSelected: state.isSelected,
    },
  })

  return {
    container: createStyleResolver((state: ChatConversationRowState): ChatConversationRowStyle => (
      toContainerStyle(resolve(state).container)
    )),
    title: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTitleStyle => (
      toTextStyle(resolve(state).title)
    )),
    timestamp: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTimestampStyle => (
      toTextStyle(resolve(state).timestamp)
    )),
    preview: createStyleResolver((state: ChatConversationRowState): ChatConversationRowPreviewStyle => (
      toTextStyle(resolve(state).preview)
    )),
    unreadBadge: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeStyle => (
      toContainerStyle(resolve().unreadBadge)
    )),
    unreadBadgeText: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeTextStyle => (
      toTextStyle(resolve().unreadBadgeText)
    )),
    sentIndicator: createSimpleValueResolver((): ChatMessageBubbleReceiptIconStyle => ({
      color: resolve().sentIndicator.color,
    })),
  }
}
