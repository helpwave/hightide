import {
  avatarGroupTokens,
  avatarTokens,
  avatarWithStatusTokens
} from './avatar-tokens'
import { buttonTokens } from './button-tokens'
import { cardTokens } from './card-tokens'
import { chatAttachmentMessageBubbleTokens } from './chat/attachment-message-bubble'
import { chatConversationListTokens } from './chat/conversation-list'
import { chatConversationRowTokens } from './chat/conversation-row'
import { chatDateDividerTokens } from './chat/date-divider'
import { chatMessageBubbleTokens } from './chat/message-bubble'
import { chatMessageComposerTokens } from './chat/message-composer'
import { chatMessageListTokens } from './chat/message-list'
import { chatQuickReplyChipTokens } from './chat/quick-reply-chip'
import { chatSystemLineTokens } from './chat/system-line'
import { chatThreadHeaderTokens } from './chat/thread-header'
import { checkboxTokens } from './checkbox-tokens'
import { chipTokens } from './chip-tokens'
import { dividerTokens } from './divider-tokens'
import { iconButtonTokens } from './icon-button-tokens'
import { iconTokens } from './icon-tokens'
import { inputTokens } from './input-tokens'
import { listActionOverlayTokens } from './list-items/list-action-tokens'
import { listItemTokens } from './list-items/list-item-tokens'
import { modalTokens } from './modal-tokens'
import { multiSelectTokens } from './multi-select-tokens'
import { pressableTokens } from './pressable-tokens'
import { searchBarTokens } from './search-bar-tokens'
import { selectTokens } from './select-tokens'
import { switchTokens } from './switch-tokens'
import { textareaContainerOverlayTokens } from './textarea-tokens'

export const componentTokens = {
  button: buttonTokens,
  iconButton: iconButtonTokens,
  pressable: pressableTokens,
  chip: chipTokens,
  checkbox: checkboxTokens,
  switch: switchTokens,
  input: inputTokens,
  textarea: textareaContainerOverlayTokens,
  searchBar: searchBarTokens,
  select: selectTokens,
  multiSelect: multiSelectTokens,
  card: cardTokens,
  divider: dividerTokens,
  listItem: {
    default: listItemTokens,
    action: listActionOverlayTokens,
  },
  modal: modalTokens,
  avatar: avatarTokens,
  avatarWithStatus: avatarWithStatusTokens,
  avatarGroup: avatarGroupTokens,
  icon: iconTokens,
  chat: {
    conversationRow: chatConversationRowTokens,
    conversationList: chatConversationListTokens,
    threadHeader: chatThreadHeaderTokens,
    messageList: chatMessageListTokens,
    messageBubble: chatMessageBubbleTokens,
    attachmentMessageBubble: chatAttachmentMessageBubbleTokens,
    systemLine: chatSystemLineTokens,
    dateDivider: chatDateDividerTokens,
    quickReplyChip: chatQuickReplyChipTokens,
    messageComposer: chatMessageComposerTokens,
  },
} as const

export type ComponentTokens = typeof componentTokens
