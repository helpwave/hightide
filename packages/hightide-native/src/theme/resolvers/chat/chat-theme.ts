import type { ChatThemeResolvers } from '../../types/components/chat'
import type { ComponentThemeResolver } from '../../types/resolver'
import { toChatAttachmentMessageBubbleThemeResolvers } from './attachment-message-bubble'
import { toChatConversationListThemeResolvers } from './conversation-list'
import { toChatConversationRowThemeResolvers } from './conversation-row'
import { toChatDateDividerThemeResolvers } from './date-divider'
import { toChatMessageBubbleThemeResolvers } from './message-bubble'
import { toChatMessageComposerThemeResolvers } from './message-composer'
import { toChatMessageListThemeResolvers } from './message-list'
import { toChatQuickReplyChipThemeResolvers } from './quick-reply-chip'
import { toChatSystemLineThemeResolvers } from './system-line'
import { toChatThreadHeaderThemeResolvers } from './thread-header'

export const toChatThemeResolvers: ComponentThemeResolver<ChatThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => ({
  conversationRow: toChatConversationRowThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens,
  }),
  conversationList: toChatConversationListThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens,
  }),
  threadHeader: toChatThreadHeaderThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens,
  }),
  messageList: toChatMessageListThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens,
  }),
  messageBubble: toChatMessageBubbleThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens,
  }),
  attachmentMessageBubble: toChatAttachmentMessageBubbleThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens,
  }),
  systemLine: toChatSystemLineThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens,
  }),
  dateDivider: toChatDateDividerThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens,
  }),
  quickReplyChip: toChatQuickReplyChipThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens,
  }),
  messageComposer: toChatMessageComposerThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens,
  }),
})
