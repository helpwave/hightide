import type { ColorValue, ColoringType } from '@helpwave/hightide-design'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import type { InteractionState, StyleResolverFunction } from './resolver'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export type ChatConversationRowState = InteractionState & {
  isUnread?: boolean,
  isSelected?: boolean,
}

export type ChatConversationRowStyle = StyleProp<ViewStyle>
export type ChatConversationRowTitleStyle = StyleProp<TextStyle>
export type ChatConversationRowTimestampStyle = StyleProp<TextStyle>
export type ChatConversationRowPreviewStyle = StyleProp<TextStyle>
export type ChatConversationRowUnreadBadgeStyle = StyleProp<ViewStyle>
export type ChatConversationRowUnreadBadgeTextStyle = StyleProp<TextStyle>
export type ChatConversationListStyle = StyleProp<ViewStyle>
export type ChatConversationListHeaderStyle = StyleProp<ViewStyle>
export type ChatConversationListFooterStyle = StyleProp<ViewStyle>
export type ChatThreadHeaderStyle = StyleProp<ViewStyle>
export type ChatThreadHeaderTitleStyle = StyleProp<TextStyle>
export type ChatThreadHeaderSubtitleStyle = StyleProp<TextStyle>
export type ChatMessageListStyle = StyleProp<ViewStyle>

export type ChatMessageBubbleState = {
  direction: ChatMessageDirection,
}

export type ChatMessageBubbleContainerStyle = StyleProp<ViewStyle>
export type ChatMessageBubbleStyle = StyleProp<ViewStyle>
export type ChatMessageBubbleContentStyle = StyleProp<TextStyle>
export type ChatMessageBubbleTimestampStyle = StyleProp<TextStyle>
export type ChatMessageBubbleReceiptStyle = StyleProp<ViewStyle>
export type ChatMessageBubbleReceiptTextStyle = StyleProp<TextStyle>

export type ChatMessageBubbleReceiptIconStyle = {
  color: ColorValue,
}

export type ChatMessageCardState = {
  direction: ChatMessageDirection,
  color?: ColoringType,
}

export type ChatMessageCardStyle = StyleProp<ViewStyle>
export type ChatMessageCardHeaderStyle = StyleProp<ViewStyle>
export type ChatMessageCardIconStyle = StyleProp<ViewStyle>

export type ChatMessageCardIconColor = {
  color: ColorValue,
}

export type ChatMessageCardTitleStyle = StyleProp<TextStyle>
export type ChatMessageCardSubtitleStyle = StyleProp<TextStyle>
export type ChatMessageCardBodyStyle = StyleProp<ViewStyle>
export type ChatMessageCardActionsStyle = StyleProp<ViewStyle>

export type ChatAttachmentCardState = {
  direction: ChatMessageDirection,
}

export type ChatAttachmentCardStyle = StyleProp<ViewStyle>
export type ChatAttachmentCardIconStyle = StyleProp<ViewStyle>

export type ChatAttachmentCardIconColor = {
  color: ColorValue,
}

export type ChatAttachmentCardNameStyle = StyleProp<TextStyle>
export type ChatAttachmentCardMetadataStyle = StyleProp<TextStyle>

export type ChatSystemLineState = {
  color?: ColoringType,
}

export type ChatSystemLineStyle = StyleProp<ViewStyle>
export type ChatSystemLineTextStyle = StyleProp<TextStyle>

export type ChatSystemLineIconStyle = {
  color: ColorValue,
}

export type ChatDateDividerStyle = StyleProp<ViewStyle>
export type ChatDateDividerTextStyle = StyleProp<TextStyle>

export type ChatQuickReplyChipState = InteractionState & {
  isActive?: boolean,
}

export type ChatQuickReplyChipStyle = StyleProp<ViewStyle>
export type ChatQuickReplyChipTextStyle = StyleProp<TextStyle>
export type ChatMessageComposerStyle = StyleProp<ViewStyle>
export type ChatMessageComposerInputStyle = StyleProp<TextStyle>

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
