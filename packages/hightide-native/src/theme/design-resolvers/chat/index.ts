import type { ChatTokenResolvers } from '@helpwave/hightide-design/component-tokens'
import { chatAttachmentMessageBubbleTokenResolver } from './attachment-message-bubble'
import { chatConversationListTokenResolver } from './conversation-list'
import { chatConversationRowTokenResolver } from './conversation-row'
import { chatDateDividerTokenResolver } from './date-divider'
import { chatMessageBubbleTokenResolver } from './message-bubble'
import { chatMessageComposerTokenResolver } from './message-composer'
import { chatMessageListTokenResolver } from './message-list'
import { chatQuickReplyChipTokenResolver } from './quick-reply-chip'
import { chatSystemLineTokenResolver } from './system-line'
import { chatThreadHeaderTokenResolver } from './thread-header'

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

export * from './attachment-message-bubble'
export * from './conversation-list'
export * from './conversation-row'
export * from './date-divider'
export * from './message-bubble'
export * from './message-composer'
export * from './message-list'
export * from './quick-reply-chip'
export * from './shared'
export * from './system-line'
export * from './thread-header'
