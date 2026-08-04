import { hightideChatTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { ChatState as ChatTokenState } from '@helpwave/hightide-design/component-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../types/color'
import type {
  ChatAttachmentCardIconColor,
  ChatAttachmentCardIconStyle,
  ChatAttachmentCardMetadataStyle,
  ChatAttachmentCardNameStyle,
  ChatAttachmentCardState,
  ChatAttachmentCardStyle,
  ChatAttachmentCardTheme,
  ChatConversationListFooterStyle,
  ChatConversationListHeaderStyle,
  ChatConversationListStyle,
  ChatConversationListTheme,
  ChatConversationRowPreviewStyle,
  ChatConversationRowState,
  ChatConversationRowStyle,
  ChatConversationRowTheme,
  ChatConversationRowTimestampStyle,
  ChatConversationRowTitleStyle,
  ChatConversationRowUnreadBadgeStyle,
  ChatConversationRowUnreadBadgeTextStyle,
  ChatDateDividerStyle,
  ChatDateDividerTextStyle,
  ChatDateDividerTheme,
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleContentStyle,
  ChatMessageBubbleReceiptIconStyle,
  ChatMessageBubbleReceiptStyle,
  ChatMessageBubbleReceiptTextStyle,
  ChatMessageBubbleState,
  ChatMessageBubbleStyle,
  ChatMessageBubbleTheme,
  ChatMessageBubbleTimestampStyle,
  ChatMessageCardActionsStyle,
  ChatMessageCardBodyStyle,
  ChatMessageCardHeaderStyle,
  ChatMessageCardIconColor,
  ChatMessageCardIconStyle,
  ChatMessageCardState,
  ChatMessageCardStyle,
  ChatMessageCardSubtitleStyle,
  ChatMessageCardTheme,
  ChatMessageCardTitleStyle,
  ChatMessageComposerInputStyle,
  ChatMessageComposerStyle,
  ChatMessageComposerTheme,
  ChatMessageListStyle,
  ChatMessageListTheme,
  ChatQuickReplyChipState,
  ChatQuickReplyChipStyle,
  ChatQuickReplyChipTextStyle,
  ChatQuickReplyChipTheme,
  ChatSystemLineIconStyle,
  ChatSystemLineState,
  ChatSystemLineStyle,
  ChatSystemLineTextStyle,
  ChatSystemLineTheme,
  ChatTheme,
  ChatThreadHeaderStyle,
  ChatThreadHeaderSubtitleStyle,
  ChatThreadHeaderTheme,
  ChatThreadHeaderTitleStyle
} from '../types/components/chat'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

type ChatTokenResolver = (state: ChatTokenState) => ReturnType<typeof hightideChatTokenResolver>

const toConversationRowTokenState = (state: ChatConversationRowState): ChatTokenState => ({
  isPressed: state.isPressed,
  isDisabled: state.isDisabled,
  isUnread: state.isUnread,
  isSelected: state.isSelected,
})

const toQuickReplyChipTokenState = (state: ChatQuickReplyChipState): ChatTokenState => ({
  isPressed: state.isPressed,
  isDisabled: state.isDisabled,
  isActive: state.isActive,
})

const toConversationRowTheme = (resolve: ChatTokenResolver): ChatConversationRowTheme => ({
  container: createStyleResolver((state: ChatConversationRowState): ChatConversationRowStyle => ({
    ...resolve(toConversationRowTokenState(state)).conversationRow.container,
  })),
  title: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTitleStyle => ({
    ...resolve(toConversationRowTokenState(state)).conversationRow.title,
  })),
  timestamp: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTimestampStyle => ({
    ...resolve(toConversationRowTokenState(state)).conversationRow.timestamp,
  })),
  preview: createStyleResolver((state: ChatConversationRowState): ChatConversationRowPreviewStyle => ({
    ...resolve(toConversationRowTokenState(state)).conversationRow.preview,
  })),
  unreadBadge: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeStyle => ({
    ...resolve({}).conversationRow.unreadBadge,
  })),
  unreadBadgeText: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeTextStyle => ({
    ...resolve({}).conversationRow.unreadBadgeText,
  })),
  sentIndicator: createSimpleValueResolver((): ChatMessageBubbleReceiptIconStyle => ({
    color: resolve({}).conversationRow.sentIndicator.color,
  })),
})

const toConversationListTheme = (resolve: ChatTokenResolver): ChatConversationListTheme => ({
  container: createSimpleStyleResolver((): ChatConversationListStyle => ({
    ...resolve({}).conversationList.container,
  })),
  header: createSimpleStyleResolver((): ChatConversationListHeaderStyle => ({
    ...resolve({}).conversationList.header,
  })),
  footer: createSimpleStyleResolver((): ChatConversationListFooterStyle => ({
    ...resolve({}).conversationList.footer,
  })),
})

const toThreadHeaderTheme = (resolve: ChatTokenResolver): ChatThreadHeaderTheme => ({
  container: createSimpleStyleResolver((): ChatThreadHeaderStyle => ({
    ...resolve({}).threadHeader.container,
  })),
  title: createSimpleStyleResolver((): ChatThreadHeaderTitleStyle => ({
    ...resolve({}).threadHeader.title,
  })),
  subtitle: createSimpleStyleResolver((): ChatThreadHeaderSubtitleStyle => ({
    ...resolve({}).threadHeader.subtitle,
  })),
})

const toMessageListTheme = (resolve: ChatTokenResolver): ChatMessageListTheme => ({
  container: createSimpleStyleResolver((): ChatMessageListStyle => ({
    ...resolve({}).messageList.container,
  })),
})

const toMessageBubbleTheme = (resolve: ChatTokenResolver): ChatMessageBubbleTheme => ({
  container: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleContainerStyle => ({
    ...resolve({ direction: state.direction }).messageBubble.container,
  })),
  bubble: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleStyle => ({
    ...resolve({ direction: state.direction }).messageBubble.bubble,
  })),
  content: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleContentStyle => ({
    ...resolve({ direction: state.direction }).messageBubble.content,
  })),
  timestamp: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleTimestampStyle => ({
    ...resolve({ direction: state.direction }).messageBubble.timestamp,
  })),
  receipt: createSimpleStyleResolver((): ChatMessageBubbleReceiptStyle => ({
    ...resolve({}).messageBubble.receipt,
  })),
  receiptText: createSimpleStyleResolver((): ChatMessageBubbleReceiptTextStyle => ({
    ...resolve({}).messageBubble.receiptText,
  })),
  receiptIcon: createSimpleValueResolver((): ChatMessageBubbleReceiptIconStyle => ({
    color: resolve({}).messageBubble.receiptIcon.color,
  })),
})

const toMessageCardTheme = (resolve: ChatTokenResolver): ChatMessageCardTheme => {
  const toTokenState = (state: ChatMessageCardState): ChatTokenState => ({
    direction: state.direction,
    color: state.color,
  })

  return {
    container: createStyleResolver((state: ChatMessageCardState): ChatMessageCardStyle => ({
      ...resolve(toTokenState(state)).messageCard.container,
    })),
    header: createSimpleStyleResolver((): ChatMessageCardHeaderStyle => ({
      ...resolve({}).messageCard.header,
    })),
    icon: createStyleResolver((state: ChatMessageCardState): ChatMessageCardIconStyle => ({
      ...resolve(toTokenState(state)).messageCard.icon,
    })),
    iconColor: createValueResolver((state: ChatMessageCardState): ChatMessageCardIconColor => ({
      color: resolve(toTokenState(state)).messageCard.iconColor.color,
    })),
    title: createStyleResolver((state: ChatMessageCardState): ChatMessageCardTitleStyle => ({
      ...resolve(toTokenState(state)).messageCard.title,
    })),
    subtitle: createSimpleStyleResolver((): ChatMessageCardSubtitleStyle => ({
      ...resolve({}).messageCard.subtitle,
    })),
    body: createSimpleStyleResolver((): ChatMessageCardBodyStyle => ({
      ...resolve({}).messageCard.body,
    })),
    actions: createSimpleStyleResolver((): ChatMessageCardActionsStyle => ({
      ...resolve({}).messageCard.actions,
    })),
  }
}

const toAttachmentCardTheme = (resolve: ChatTokenResolver): ChatAttachmentCardTheme => ({
  container: createStyleResolver((state: ChatAttachmentCardState): ChatAttachmentCardStyle => ({
    ...resolve({ direction: state.direction }).attachmentCard.container,
  })),
  icon: createSimpleStyleResolver((): ChatAttachmentCardIconStyle => ({
    ...resolve({}).attachmentCard.icon,
  })),
  iconColor: createSimpleValueResolver((): ChatAttachmentCardIconColor => ({
    color: resolve({}).attachmentCard.iconColor.color,
  })),
  name: createSimpleStyleResolver((): ChatAttachmentCardNameStyle => ({
    ...resolve({}).attachmentCard.name,
  })),
  metadata: createSimpleStyleResolver((): ChatAttachmentCardMetadataStyle => ({
    ...resolve({}).attachmentCard.metadata,
  })),
})

const toSystemLineTheme = (resolve: ChatTokenResolver): ChatSystemLineTheme => ({
  container: createStyleResolver((state: ChatSystemLineState): ChatSystemLineStyle => ({
    ...resolve({ color: state.color }).systemLine.container,
  })),
  text: createStyleResolver((state: ChatSystemLineState): ChatSystemLineTextStyle => ({
    ...resolve({ color: state.color }).systemLine.text,
  })),
  icon: createValueResolver((state: ChatSystemLineState): ChatSystemLineIconStyle => ({
    color: resolve({ color: state.color }).systemLine.icon.color,
  })),
})

const toDateDividerTheme = (resolve: ChatTokenResolver): ChatDateDividerTheme => ({
  container: createSimpleStyleResolver((): ChatDateDividerStyle => ({
    ...resolve({}).dateDivider.container,
  })),
  text: createSimpleStyleResolver((): ChatDateDividerTextStyle => ({
    ...resolve({}).dateDivider.text,
  })),
})

const toQuickReplyChipTheme = (resolve: ChatTokenResolver): ChatQuickReplyChipTheme => ({
  container: createStyleResolver((state: ChatQuickReplyChipState): ChatQuickReplyChipStyle => ({
    ...resolve(toQuickReplyChipTokenState(state)).quickReplyChip.container,
  })),
  text: createStyleResolver((state: ChatQuickReplyChipState): ChatQuickReplyChipTextStyle => ({
    ...resolve(toQuickReplyChipTokenState(state)).quickReplyChip.text,
  })),
})

const toMessageComposerTheme = (resolve: ChatTokenResolver): ChatMessageComposerTheme => ({
  container: createSimpleStyleResolver((): ChatMessageComposerStyle => ({
    ...resolve({}).messageComposer.container,
  })),
  input: createSimpleStyleResolver((): ChatMessageComposerInputStyle => ({
    ...resolve({}).messageComposer.input,
  })),
  placeholderColor: createSimpleValueResolver((): Color => (
    resolve({}).messageComposer.placeholderColor
  )),
})

export const toChatTheme = (themeTokens: ThemeTokens): ChatTheme => {
  const resolve: ChatTokenResolver = (state) => hightideChatTokenResolver({ themeTokens, state })

  return {
    conversationRow: toConversationRowTheme(resolve),
    conversationList: toConversationListTheme(resolve),
    threadHeader: toThreadHeaderTheme(resolve),
    messageList: toMessageListTheme(resolve),
    messageBubble: toMessageBubbleTheme(resolve),
    messageCard: toMessageCardTheme(resolve),
    attachmentCard: toAttachmentCardTheme(resolve),
    systemLine: toSystemLineTheme(resolve),
    dateDivider: toDateDividerTheme(resolve),
    quickReplyChip: toQuickReplyChipTheme(resolve),
    messageComposer: toMessageComposerTheme(resolve),
  }
}
