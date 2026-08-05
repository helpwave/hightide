import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type { ChatTheme } from '../../types/components/chat'
import { toAttachmentCardTheme } from './attachment-card'
import { toConversationListTheme } from './conversation-list'
import { toConversationRowTheme } from './conversation-row'
import { toDateDividerTheme } from './date-divider'
import { toMessageBubbleTheme } from './message-bubble'
import { toMessageCardTheme } from './message-card'
import { toMessageComposerTheme } from './message-composer'
import { toMessageListTheme } from './message-list'
import { toQuickReplyChipTheme } from './quick-reply-chip'
import { toSystemLineTheme } from './system-line'
import { toThreadHeaderTheme } from './thread-header'

export const toChatTheme = (themeTokens: ThemeTokens): ChatTheme => ({
  conversationRow: toConversationRowTheme(themeTokens),
  conversationList: toConversationListTheme(themeTokens),
  threadHeader: toThreadHeaderTheme(themeTokens),
  messageList: toMessageListTheme(themeTokens),
  messageBubble: toMessageBubbleTheme(themeTokens),
  messageCard: toMessageCardTheme(themeTokens),
  attachmentCard: toAttachmentCardTheme(themeTokens),
  systemLine: toSystemLineTheme(themeTokens),
  dateDivider: toDateDividerTheme(themeTokens),
  quickReplyChip: toQuickReplyChipTheme(themeTokens),
  messageComposer: toMessageComposerTheme(themeTokens),
})
