import type { ChatThemeResolvers } from '../../types/components/chat'
import type { ComponentThemeResolver } from '../../types/resolver'
import { toChatAttachmentCardThemeResolvers } from './attachment-card'
import { toChatConversationListThemeResolvers } from './conversation-list'
import { toChatConversationRowThemeResolvers } from './conversation-row'
import { toChatDateDividerThemeResolvers } from './date-divider'
import { toChatMessageBubbleThemeResolvers } from './message-bubble'
import { toChatMessageCardThemeResolvers } from './message-card'
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
    componentTokens: componentTokens.chat.conversationRow,
  }),
  conversationList: toChatConversationListThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens: componentTokens.chat.conversationList,
  }),
  threadHeader: toChatThreadHeaderThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens: componentTokens.chat.threadHeader,
  }),
  messageList: toChatMessageListThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens: componentTokens.chat.messageList,
  }),
  messageBubble: toChatMessageBubbleThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens: componentTokens.chat.messageBubble,
  }),
  messageCard: toChatMessageCardThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens: componentTokens.chat.messageCard,
  }),
  attachmentCard: toChatAttachmentCardThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens: componentTokens.chat.attachmentCard,
  }),
  systemLine: toChatSystemLineThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens: componentTokens.chat.systemLine,
  }),
  dateDivider: toChatDateDividerThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens: componentTokens.chat.dateDivider,
  }),
  quickReplyChip: toChatQuickReplyChipThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens: componentTokens.chat.quickReplyChip,
  }),
  messageComposer: toChatMessageComposerThemeResolvers({
    themeTokens,
    semanticTokens,
    componentTokens: componentTokens.chat.messageComposer,
  }),
})
