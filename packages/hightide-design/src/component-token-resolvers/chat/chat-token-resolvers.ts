import { chatAttachmentCardTokenResolver, type ChatAttachmentCardTokenResolver } from './attachment-card'
import { chatConversationListTokenResolver, type ChatConversationListTokenResolver } from './conversation-list'
import { chatConversationRowTokenResolver, type ChatConversationRowTokenResolver } from './conversation-row'
import { chatDateDividerTokenResolver, type ChatDateDividerTokenResolver } from './date-divider'
import { chatMessageBubbleTokenResolver, type ChatMessageBubbleTokenResolver } from './message-bubble'
import { chatMessageCardTokenResolver, type ChatMessageCardTokenResolver } from './message-card'
import { chatMessageComposerTokenResolver, type ChatMessageComposerTokenResolver } from './message-composer'
import { chatMessageListTokenResolver, type ChatMessageListTokenResolver } from './message-list'
import { chatQuickReplyChipTokenResolver, type ChatQuickReplyChipTokenResolver } from './quick-reply-chip'
import { chatSystemLineTokenResolver, type ChatSystemLineTokenResolver } from './system-line'
import { chatThreadHeaderTokenResolver, type ChatThreadHeaderTokenResolver } from './thread-header'

export type ChatTokenResolvers = {
  conversationRow: ChatConversationRowTokenResolver,
  conversationList: ChatConversationListTokenResolver,
  threadHeader: ChatThreadHeaderTokenResolver,
  messageList: ChatMessageListTokenResolver,
  messageBubble: ChatMessageBubbleTokenResolver,
  messageCard: ChatMessageCardTokenResolver,
  attachmentCard: ChatAttachmentCardTokenResolver,
  systemLine: ChatSystemLineTokenResolver,
  dateDivider: ChatDateDividerTokenResolver,
  quickReplyChip: ChatQuickReplyChipTokenResolver,
  messageComposer: ChatMessageComposerTokenResolver,
}

export const chatTokenResolvers: ChatTokenResolvers = {
  conversationRow: chatConversationRowTokenResolver,
  conversationList: chatConversationListTokenResolver,
  threadHeader: chatThreadHeaderTokenResolver,
  messageList: chatMessageListTokenResolver,
  messageBubble: chatMessageBubbleTokenResolver,
  messageCard: chatMessageCardTokenResolver,
  attachmentCard: chatAttachmentCardTokenResolver,
  systemLine: chatSystemLineTokenResolver,
  dateDivider: chatDateDividerTokenResolver,
  quickReplyChip: chatQuickReplyChipTokenResolver,
  messageComposer: chatMessageComposerTokenResolver,
}