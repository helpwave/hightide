import type { ColoringType } from '@helpwave/hightide-design/helpers'
import type { ColorValue } from '@helpwave/hightide-design/types'
import type { TextStyle, ViewStyle } from 'react-native'
import type { InteractionState, StyleResolverFunction } from './resolver'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export type ChatConversationRowState = InteractionState & {
  isUnread?: boolean,
  isSelected?: boolean,
}

export type ChatConversationRowStyle = ViewStyle
export type ChatConversationRowTitleStyle = TextStyle
export type ChatConversationRowTimestampStyle = TextStyle
export type ChatConversationRowPreviewStyle = TextStyle
export type ChatConversationRowUnreadBadgeStyle = ViewStyle
export type ChatConversationRowUnreadBadgeTextStyle = TextStyle
export type ChatConversationListStyle = ViewStyle
export type ChatConversationListHeaderStyle = ViewStyle
export type ChatConversationListFooterStyle = ViewStyle
export type ChatThreadHeaderStyle = ViewStyle
export type ChatThreadHeaderTitleStyle = TextStyle
export type ChatThreadHeaderSubtitleStyle = TextStyle
export type ChatMessageListStyle = ViewStyle

export type ChatMessageBubbleState = {
  direction: ChatMessageDirection,
}

export type ChatMessageBubbleContainerStyle = ViewStyle
export type ChatMessageBubbleStyle = ViewStyle
export type ChatMessageBubbleContentStyle = TextStyle
export type ChatMessageBubbleTimestampStyle = TextStyle
export type ChatMessageBubbleReceiptStyle = ViewStyle
export type ChatMessageBubbleReceiptTextStyle = TextStyle

export type ChatMessageBubbleReceiptIconStyle = {
  color: ColorValue,
}

export type ChatMessageCardState = {
  direction: ChatMessageDirection,
  color?: ColoringType,
}

export type ChatMessageCardStyle = ViewStyle
export type ChatMessageCardHeaderStyle = ViewStyle
export type ChatMessageCardIconStyle = ViewStyle

export type ChatMessageCardIconColor = {
  color: ColorValue,
}

export type ChatMessageCardTitleStyle = TextStyle
export type ChatMessageCardSubtitleStyle = TextStyle
export type ChatMessageCardBodyStyle = ViewStyle
export type ChatMessageCardActionsStyle = ViewStyle

export type ChatAttachmentCardState = {
  direction: ChatMessageDirection,
}

export type ChatAttachmentCardStyle = ViewStyle
export type ChatAttachmentCardIconStyle = ViewStyle

export type ChatAttachmentCardIconColor = {
  color: ColorValue,
}

export type ChatAttachmentCardNameStyle = TextStyle
export type ChatAttachmentCardMetadataStyle = TextStyle

export type ChatSystemLineState = {
  color?: ColoringType,
}

export type ChatSystemLineStyle = ViewStyle
export type ChatSystemLineTextStyle = TextStyle

export type ChatSystemLineIconStyle = {
  color: ColorValue,
}

export type ChatDateDividerStyle = ViewStyle
export type ChatDateDividerTextStyle = TextStyle

export type ChatQuickReplyChipState = InteractionState & {
  isActive?: boolean,
}

export type ChatQuickReplyChipStyle = ViewStyle
export type ChatQuickReplyChipTextStyle = TextStyle
export type ChatMessageComposerStyle = ViewStyle
export type ChatMessageComposerInputStyle = TextStyle

export type ChatTheme = {
  conversationRow: StyleResolverFunction<ChatConversationRowState, ChatConversationRowStyle>,
  conversationRowTitle: StyleResolverFunction<ChatConversationRowState, ChatConversationRowTitleStyle>,
  conversationRowTimestamp: StyleResolverFunction<ChatConversationRowState, ChatConversationRowTimestampStyle>,
  conversationRowPreview: StyleResolverFunction<ChatConversationRowState, ChatConversationRowPreviewStyle>,
  conversationRowUnreadBadge: StyleResolverFunction<Record<string, never>, ChatConversationRowUnreadBadgeStyle>,
  conversationRowUnreadBadgeText: StyleResolverFunction<Record<string, never>, ChatConversationRowUnreadBadgeTextStyle>,
  conversationRowSentIndicator: StyleResolverFunction<Record<string, never>, ChatMessageBubbleReceiptIconStyle>,
  conversationList: StyleResolverFunction<Record<string, never>, ChatConversationListStyle>,
  conversationListHeader: StyleResolverFunction<Record<string, never>, ChatConversationListHeaderStyle>,
  conversationListFooter: StyleResolverFunction<Record<string, never>, ChatConversationListFooterStyle>,
  threadHeader: StyleResolverFunction<Record<string, never>, ChatThreadHeaderStyle>,
  threadHeaderTitle: StyleResolverFunction<Record<string, never>, ChatThreadHeaderTitleStyle>,
  threadHeaderSubtitle: StyleResolverFunction<Record<string, never>, ChatThreadHeaderSubtitleStyle>,
  messageList: StyleResolverFunction<Record<string, never>, ChatMessageListStyle>,
  messageBubbleContainer: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleContainerStyle>,
  messageBubble: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleStyle>,
  messageBubbleContent: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleContentStyle>,
  messageBubbleTimestamp: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleTimestampStyle>,
  messageBubbleReceipt: StyleResolverFunction<Record<string, never>, ChatMessageBubbleReceiptStyle>,
  messageBubbleReceiptText: StyleResolverFunction<Record<string, never>, ChatMessageBubbleReceiptTextStyle>,
  messageBubbleReceiptIcon: StyleResolverFunction<Record<string, never>, ChatMessageBubbleReceiptIconStyle>,
  messageCard: StyleResolverFunction<ChatMessageCardState, ChatMessageCardStyle>,
  messageCardHeader: StyleResolverFunction<Record<string, never>, ChatMessageCardHeaderStyle>,
  messageCardIcon: StyleResolverFunction<ChatMessageCardState, ChatMessageCardIconStyle>,
  messageCardIconColor: StyleResolverFunction<ChatMessageCardState, ChatMessageCardIconColor>,
  messageCardTitle: StyleResolverFunction<ChatMessageCardState, ChatMessageCardTitleStyle>,
  messageCardSubtitle: StyleResolverFunction<Record<string, never>, ChatMessageCardSubtitleStyle>,
  messageCardBody: StyleResolverFunction<Record<string, never>, ChatMessageCardBodyStyle>,
  messageCardActions: StyleResolverFunction<Record<string, never>, ChatMessageCardActionsStyle>,
  attachmentCard: StyleResolverFunction<ChatAttachmentCardState, ChatAttachmentCardStyle>,
  attachmentCardIcon: StyleResolverFunction<Record<string, never>, ChatAttachmentCardIconStyle>,
  attachmentCardIconColor: StyleResolverFunction<Record<string, never>, ChatAttachmentCardIconColor>,
  attachmentCardName: StyleResolverFunction<Record<string, never>, ChatAttachmentCardNameStyle>,
  attachmentCardMetadata: StyleResolverFunction<Record<string, never>, ChatAttachmentCardMetadataStyle>,
  systemLine: StyleResolverFunction<ChatSystemLineState, ChatSystemLineStyle>,
  systemLineText: StyleResolverFunction<ChatSystemLineState, ChatSystemLineTextStyle>,
  systemLineIcon: StyleResolverFunction<ChatSystemLineState, ChatSystemLineIconStyle>,
  dateDivider: StyleResolverFunction<Record<string, never>, ChatDateDividerStyle>,
  dateDividerText: StyleResolverFunction<Record<string, never>, ChatDateDividerTextStyle>,
  quickReplyChip: StyleResolverFunction<ChatQuickReplyChipState, ChatQuickReplyChipStyle>,
  quickReplyChipText: StyleResolverFunction<ChatQuickReplyChipState, ChatQuickReplyChipTextStyle>,
  messageComposer: StyleResolverFunction<Record<string, never>, ChatMessageComposerStyle>,
  messageComposerInput: StyleResolverFunction<Record<string, never>, ChatMessageComposerInputStyle>,
  messageComposerPlaceholderColor: StyleResolverFunction<Record<string, never>, ColorValue>,
}
