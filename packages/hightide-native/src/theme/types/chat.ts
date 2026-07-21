import type { ColorValue, ColoringType, FontWeight } from '@helpwave/hightide-design'
import type { InteractionState, ResolverFunction } from './resolver'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export type ChatConversationRowState = InteractionState & {
  isUnread?: boolean,
  isSelected?: boolean,
}

export type ChatConversationRowStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: number,
  width: '100%',
  paddingHorizontal: number,
  paddingVertical: number,
  backgroundColor: ColorValue | 'transparent',
  borderLeftWidth: number,
  borderLeftColor: ColorValue | 'transparent',
  borderRadius: number,
}

export type ChatConversationRowTitleStyle = {
  flex: number,
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatConversationRowTimestampStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
  flexShrink: number,
}

export type ChatConversationRowPreviewStyle = {
  flex: number,
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatConversationRowUnreadBadgeStyle = {
  minWidth: number,
  height: number,
  paddingHorizontal: number,
  borderRadius: number,
  backgroundColor: ColorValue,
  alignItems: 'center',
  justifyContent: 'center',
}

export type ChatConversationRowUnreadBadgeTextStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatConversationListStyle = {
  flex: number,
  backgroundColor: ColorValue,
}

export type ChatConversationListHeaderStyle = {
  paddingHorizontal: number,
  paddingVertical: number,
  gap: number,
}

export type ChatConversationListFooterStyle = {
  paddingHorizontal: number,
  paddingVertical: number,
}

export type ChatThreadHeaderStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: number,
  paddingHorizontal: number,
  paddingVertical: number,
  borderBottomWidth: number,
  borderBottomColor: ColorValue,
  backgroundColor: ColorValue,
}

export type ChatThreadHeaderTitleStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatThreadHeaderSubtitleStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatMessageListStyle = {
  flex: number,
  paddingHorizontal: number,
  paddingVertical: number,
  gap: number,
  backgroundColor: ColorValue,
}

export type ChatMessageBubbleState = {
  direction: ChatMessageDirection,
}

export type ChatMessageBubbleContainerStyle = {
  maxWidth: number,
  gap: number,
  alignSelf: 'flex-start' | 'flex-end',
  alignItems: 'flex-start' | 'flex-end',
}

export type ChatMessageBubbleStyle = {
  paddingHorizontal: number,
  paddingVertical: number,
  backgroundColor: ColorValue,
  borderTopLeftRadius: number,
  borderTopRightRadius: number,
  borderBottomLeftRadius: number,
  borderBottomRightRadius: number,
}

export type ChatMessageBubbleContentStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
  lineHeight: number,
}

export type ChatMessageBubbleTimestampStyle = {
  marginTop: number,
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
  textAlign: 'right',
}

export type ChatMessageBubbleReceiptStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: number,
}

export type ChatMessageBubbleReceiptTextStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatMessageBubbleReceiptIconStyle = {
  color: ColorValue,
}

export type ChatMessageCardState = {
  direction: ChatMessageDirection,
  color?: ColoringType,
}

export type ChatMessageCardStyle = {
  width: number,
  maxWidth: number,
  backgroundColor: ColorValue,
  borderWidth: number,
  borderColor: ColorValue,
  borderTopLeftRadius: number,
  borderTopRightRadius: number,
  borderBottomLeftRadius: number,
  borderBottomRightRadius: number,
  overflow: 'hidden',
  alignSelf: 'flex-start' | 'flex-end',
}

export type ChatMessageCardHeaderStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: number,
  paddingHorizontal: number,
  paddingVertical: number,
  borderBottomWidth: number,
  borderBottomColor: ColorValue,
}

export type ChatMessageCardIconStyle = {
  width: number,
  height: number,
  borderRadius: number,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: ColorValue,
}

export type ChatMessageCardIconColor = {
  color: ColorValue,
}

export type ChatMessageCardTitleStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatMessageCardSubtitleStyle = {
  color: ColorValue,
  fontSize: number,
}

export type ChatMessageCardBodyStyle = {
  paddingHorizontal: number,
  paddingVertical: number,
  gap: number,
}

export type ChatMessageCardActionsStyle = {
  flexDirection: 'row',
  gap: number,
  paddingHorizontal: number,
  paddingBottom: number,
}

export type ChatAttachmentCardState = {
  direction: ChatMessageDirection,
}

export type ChatAttachmentCardStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: number,
  maxWidth: number,
  padding: number,
  backgroundColor: ColorValue,
  borderWidth: number,
  borderColor: ColorValue,
  borderTopLeftRadius: number,
  borderTopRightRadius: number,
  borderBottomLeftRadius: number,
  borderBottomRightRadius: number,
  alignSelf: 'flex-start' | 'flex-end',
}

export type ChatAttachmentCardIconStyle = {
  width: number,
  height: number,
  borderRadius: number,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: ColorValue,
}

export type ChatAttachmentCardIconColor = {
  color: ColorValue,
}

export type ChatAttachmentCardNameStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatAttachmentCardMetadataStyle = {
  color: ColorValue,
  fontSize: number,
}

export type ChatSystemLineState = {
  color?: ColoringType,
}

export type ChatSystemLineStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  gap: number,
}

export type ChatSystemLineTextStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatSystemLineIconStyle = {
  color: ColorValue,
}

export type ChatDateDividerStyle = {
  alignSelf: 'center',
  paddingHorizontal: number,
  paddingVertical: number,
  borderRadius: number,
  backgroundColor: ColorValue,
}

export type ChatDateDividerTextStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatQuickReplyChipState = InteractionState & {
  isActive?: boolean,
}

export type ChatQuickReplyChipStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: number,
  paddingHorizontal: number,
  paddingVertical: number,
  borderRadius: number,
  borderWidth: number,
  borderColor: ColorValue,
  backgroundColor: ColorValue,
}

export type ChatQuickReplyChipTextStyle = {
  color: ColorValue,
  fontSize: number,
  fontWeight: FontWeight,
}

export type ChatMessageComposerStyle = {
  flexDirection: 'row',
  alignItems: 'flex-end',
  width: '100%',
  gap: number,
  paddingHorizontal: number,
  paddingVertical: number,
  backgroundColor: ColorValue,
  borderTopWidth: number,
  borderTopColor: ColorValue,
}

export type ChatMessageComposerInputStyle = {
  flex: number,
  minHeight: number,
  maxHeight: number,
  paddingHorizontal: number,
  paddingVertical: number,
  borderRadius: number,
  backgroundColor: ColorValue,
  color: ColorValue,
  fontSize: number,
}

export type ChatTheme = {
  conversationRow: ResolverFunction<ChatConversationRowState, ChatConversationRowStyle>,
  conversationRowTitle: ResolverFunction<ChatConversationRowState, ChatConversationRowTitleStyle>,
  conversationRowTimestamp: ResolverFunction<ChatConversationRowState, ChatConversationRowTimestampStyle>,
  conversationRowPreview: ResolverFunction<ChatConversationRowState, ChatConversationRowPreviewStyle>,
  conversationRowUnreadBadge: ResolverFunction<Record<string, never>, ChatConversationRowUnreadBadgeStyle>,
  conversationRowUnreadBadgeText: ResolverFunction<Record<string, never>, ChatConversationRowUnreadBadgeTextStyle>,
  conversationRowSentIndicator: ResolverFunction<Record<string, never>, ChatMessageBubbleReceiptIconStyle>,
  conversationList: ResolverFunction<Record<string, never>, ChatConversationListStyle>,
  conversationListHeader: ResolverFunction<Record<string, never>, ChatConversationListHeaderStyle>,
  conversationListFooter: ResolverFunction<Record<string, never>, ChatConversationListFooterStyle>,
  threadHeader: ResolverFunction<Record<string, never>, ChatThreadHeaderStyle>,
  threadHeaderTitle: ResolverFunction<Record<string, never>, ChatThreadHeaderTitleStyle>,
  threadHeaderSubtitle: ResolverFunction<Record<string, never>, ChatThreadHeaderSubtitleStyle>,
  messageList: ResolverFunction<Record<string, never>, ChatMessageListStyle>,
  messageBubbleContainer: ResolverFunction<ChatMessageBubbleState, ChatMessageBubbleContainerStyle>,
  messageBubble: ResolverFunction<ChatMessageBubbleState, ChatMessageBubbleStyle>,
  messageBubbleContent: ResolverFunction<ChatMessageBubbleState, ChatMessageBubbleContentStyle>,
  messageBubbleTimestamp: ResolverFunction<ChatMessageBubbleState, ChatMessageBubbleTimestampStyle>,
  messageBubbleReceipt: ResolverFunction<Record<string, never>, ChatMessageBubbleReceiptStyle>,
  messageBubbleReceiptText: ResolverFunction<Record<string, never>, ChatMessageBubbleReceiptTextStyle>,
  messageBubbleReceiptIcon: ResolverFunction<Record<string, never>, ChatMessageBubbleReceiptIconStyle>,
  messageCard: ResolverFunction<ChatMessageCardState, ChatMessageCardStyle>,
  messageCardHeader: ResolverFunction<Record<string, never>, ChatMessageCardHeaderStyle>,
  messageCardIcon: ResolverFunction<ChatMessageCardState, ChatMessageCardIconStyle>,
  messageCardIconColor: ResolverFunction<ChatMessageCardState, ChatMessageCardIconColor>,
  messageCardTitle: ResolverFunction<ChatMessageCardState, ChatMessageCardTitleStyle>,
  messageCardSubtitle: ResolverFunction<Record<string, never>, ChatMessageCardSubtitleStyle>,
  messageCardBody: ResolverFunction<Record<string, never>, ChatMessageCardBodyStyle>,
  messageCardActions: ResolverFunction<Record<string, never>, ChatMessageCardActionsStyle>,
  attachmentCard: ResolverFunction<ChatAttachmentCardState, ChatAttachmentCardStyle>,
  attachmentCardIcon: ResolverFunction<Record<string, never>, ChatAttachmentCardIconStyle>,
  attachmentCardIconColor: ResolverFunction<Record<string, never>, ChatAttachmentCardIconColor>,
  attachmentCardName: ResolverFunction<Record<string, never>, ChatAttachmentCardNameStyle>,
  attachmentCardMetadata: ResolverFunction<Record<string, never>, ChatAttachmentCardMetadataStyle>,
  systemLine: ResolverFunction<ChatSystemLineState, ChatSystemLineStyle>,
  systemLineText: ResolverFunction<ChatSystemLineState, ChatSystemLineTextStyle>,
  systemLineIcon: ResolverFunction<ChatSystemLineState, ChatSystemLineIconStyle>,
  dateDivider: ResolverFunction<Record<string, never>, ChatDateDividerStyle>,
  dateDividerText: ResolverFunction<Record<string, never>, ChatDateDividerTextStyle>,
  quickReplyChip: ResolverFunction<ChatQuickReplyChipState, ChatQuickReplyChipStyle>,
  quickReplyChipText: ResolverFunction<ChatQuickReplyChipState, ChatQuickReplyChipTextStyle>,
  messageComposer: ResolverFunction<Record<string, never>, ChatMessageComposerStyle>,
  messageComposerInput: ResolverFunction<Record<string, never>, ChatMessageComposerInputStyle>,
  messageComposerPlaceholderColor: ResolverFunction<Record<string, never>, ColorValue>,
}
