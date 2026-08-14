import {
  chatAttachmentMessageBubbleTokenResolver,
  type ChatAttachmentMessageBubbleTokenResolver
} from './attachment-message-bubble'
import { chatConversationListTokenResolver, type ChatConversationListTokenResolver } from './conversation-list'
import { chatConversationRowTokenResolver, type ChatConversationRowTokenResolver } from './conversation-row'
import { chatDateDividerTokenResolver, type ChatDateDividerTokenResolver } from './date-divider'
import { chatMessageBubbleTokenResolver, type ChatMessageBubbleTokenResolver } from './message-bubble'
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
  attachmentMessageBubble: ChatAttachmentMessageBubbleTokenResolver,
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
  attachmentMessageBubble: chatAttachmentMessageBubbleTokenResolver,
  systemLine: chatSystemLineTokenResolver,
  dateDivider: chatDateDividerTokenResolver,
  quickReplyChip: chatQuickReplyChipTokenResolver,
  messageComposer: chatMessageComposerTokenResolver,
}
