import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ColoringType } from '@helpwave/hightide-design/helpers'

import type { Color } from '@/src/theme/types/color'
import type {
  InteractionState,
  StyleResolverFunction
} from '@/src/theme/types/resolver'

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
  color: Color,
}

export type ChatMessageCardState = {
  direction: ChatMessageDirection,
  color?: ColoringType,
}

export type ChatMessageCardStyle = ViewStyle
export type ChatMessageCardHeaderStyle = ViewStyle
export type ChatMessageCardIconStyle = ViewStyle

export type ChatMessageCardIconColor = {
  color: Color,
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
  color: Color,
}

export type ChatAttachmentCardNameStyle = TextStyle
export type ChatAttachmentCardMetadataStyle = TextStyle

export type ChatSystemLineState = {
  color?: ColoringType,
}

export type ChatSystemLineStyle = ViewStyle
export type ChatSystemLineTextStyle = TextStyle

export type ChatSystemLineIconStyle = {
  color: Color,
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

export type ChatConversationRowTheme = {
  container: StyleResolverFunction<ChatConversationRowState, ChatConversationRowStyle>,
  title: StyleResolverFunction<ChatConversationRowState, ChatConversationRowTitleStyle>,
  timestamp: StyleResolverFunction<ChatConversationRowState, ChatConversationRowTimestampStyle>,
  preview: StyleResolverFunction<ChatConversationRowState, ChatConversationRowPreviewStyle>,
  unreadBadge: StyleResolverFunction<Record<string, never>, ChatConversationRowUnreadBadgeStyle>,
  unreadBadgeText: StyleResolverFunction<Record<string, never>, ChatConversationRowUnreadBadgeTextStyle>,
  sentIndicator: StyleResolverFunction<Record<string, never>, ChatMessageBubbleReceiptIconStyle>,
}

export type ChatConversationListTheme = {
  container: StyleResolverFunction<Record<string, never>, ChatConversationListStyle>,
  header: StyleResolverFunction<Record<string, never>, ChatConversationListHeaderStyle>,
  footer: StyleResolverFunction<Record<string, never>, ChatConversationListFooterStyle>,
}

export type ChatThreadHeaderTheme = {
  container: StyleResolverFunction<Record<string, never>, ChatThreadHeaderStyle>,
  title: StyleResolverFunction<Record<string, never>, ChatThreadHeaderTitleStyle>,
  subtitle: StyleResolverFunction<Record<string, never>, ChatThreadHeaderSubtitleStyle>,
}

export type ChatMessageListTheme = {
  container: StyleResolverFunction<Record<string, never>, ChatMessageListStyle>,
}

export type ChatMessageBubbleTheme = {
  container: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleContainerStyle>,
  bubble: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleStyle>,
  content: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleContentStyle>,
  timestamp: StyleResolverFunction<ChatMessageBubbleState, ChatMessageBubbleTimestampStyle>,
  receipt: StyleResolverFunction<Record<string, never>, ChatMessageBubbleReceiptStyle>,
  receiptText: StyleResolverFunction<Record<string, never>, ChatMessageBubbleReceiptTextStyle>,
  receiptIcon: StyleResolverFunction<Record<string, never>, ChatMessageBubbleReceiptIconStyle>,
}

export type ChatMessageCardTheme = {
  container: StyleResolverFunction<ChatMessageCardState, ChatMessageCardStyle>,
  header: StyleResolverFunction<Record<string, never>, ChatMessageCardHeaderStyle>,
  icon: StyleResolverFunction<ChatMessageCardState, ChatMessageCardIconStyle>,
  iconColor: StyleResolverFunction<ChatMessageCardState, ChatMessageCardIconColor>,
  title: StyleResolverFunction<ChatMessageCardState, ChatMessageCardTitleStyle>,
  subtitle: StyleResolverFunction<Record<string, never>, ChatMessageCardSubtitleStyle>,
  body: StyleResolverFunction<Record<string, never>, ChatMessageCardBodyStyle>,
  actions: StyleResolverFunction<Record<string, never>, ChatMessageCardActionsStyle>,
}

export type ChatAttachmentCardTheme = {
  container: StyleResolverFunction<ChatAttachmentCardState, ChatAttachmentCardStyle>,
  icon: StyleResolverFunction<Record<string, never>, ChatAttachmentCardIconStyle>,
  iconColor: StyleResolverFunction<Record<string, never>, ChatAttachmentCardIconColor>,
  name: StyleResolverFunction<Record<string, never>, ChatAttachmentCardNameStyle>,
  metadata: StyleResolverFunction<Record<string, never>, ChatAttachmentCardMetadataStyle>,
}

export type ChatSystemLineTheme = {
  container: StyleResolverFunction<ChatSystemLineState, ChatSystemLineStyle>,
  text: StyleResolverFunction<ChatSystemLineState, ChatSystemLineTextStyle>,
  icon: StyleResolverFunction<ChatSystemLineState, ChatSystemLineIconStyle>,
}

export type ChatDateDividerTheme = {
  container: StyleResolverFunction<Record<string, never>, ChatDateDividerStyle>,
  text: StyleResolverFunction<Record<string, never>, ChatDateDividerTextStyle>,
}

export type ChatQuickReplyChipTheme = {
  container: StyleResolverFunction<ChatQuickReplyChipState, ChatQuickReplyChipStyle>,
  text: StyleResolverFunction<ChatQuickReplyChipState, ChatQuickReplyChipTextStyle>,
}

export type ChatMessageComposerTheme = {
  container: StyleResolverFunction<Record<string, never>, ChatMessageComposerStyle>,
  input: StyleResolverFunction<Record<string, never>, ChatMessageComposerInputStyle>,
  placeholderColor: StyleResolverFunction<Record<string, never>, Color>,
}

export type ChatTheme = {
  conversationRow: ChatConversationRowTheme,
  conversationList: ChatConversationListTheme,
  threadHeader: ChatThreadHeaderTheme,
  messageList: ChatMessageListTheme,
  messageBubble: ChatMessageBubbleTheme,
  messageCard: ChatMessageCardTheme,
  attachmentCard: ChatAttachmentCardTheme,
  systemLine: ChatSystemLineTheme,
  dateDivider: ChatDateDividerTheme,
  quickReplyChip: ChatQuickReplyChipTheme,
  messageComposer: ChatMessageComposerTheme,
}
