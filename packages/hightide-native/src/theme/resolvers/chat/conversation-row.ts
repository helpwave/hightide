import { hightideChatConversationRowTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatConversationRowPreviewStyle,
  ChatConversationRowState,
  ChatConversationRowStyle,
  ChatConversationRowTheme,
  ChatConversationRowTimestampStyle,
  ChatConversationRowTitleStyle,
  ChatConversationRowUnreadBadgeStyle,
  ChatConversationRowUnreadBadgeTextStyle,
  ChatMessageBubbleReceiptIconStyle
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver
} from '../../types/resolver'

export const toConversationRowTheme = (themeTokens: ThemeTokens): ChatConversationRowTheme => {
  const resolve = (state: ChatConversationRowState = {}) => hightideChatConversationRowTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
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
