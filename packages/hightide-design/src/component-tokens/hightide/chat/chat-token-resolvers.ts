import type { ChatAttachmentMessageBubbleTokenResolver } from './attachment-message-bubble'
import type { ChatConversationListTokenResolver } from './conversation-list'
import type { ChatConversationRowTokenResolver } from './conversation-row'
import type { ChatDateDividerTokenResolver } from './date-divider'
import type { ChatMessageBubbleTokenResolver } from './message-bubble'
import type { ChatMessageComposerTokenResolver } from './message-composer'
import type { ChatMessageListTokenResolver } from './message-list'
import type { ChatQuickReplyChipTokenResolver } from './quick-reply-chip'
import type { ChatSystemLineTokenResolver } from './system-line'
import type { ChatThreadHeaderTokenResolver } from './thread-header'

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
