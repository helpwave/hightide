import {
  chatConversationRowTokens,
  type ChatConversationRowTokenResolver,
  type ChatConversationRowTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '@helpwave/hightide-design/component-tokens'

type ChatConversationRowTokenState = 'unread' | 'selected'

export const chatConversationRowTokenResolver: ChatConversationRowTokenResolver = ({
  themeTokens,
  state,
}) => {
  const states = new Set<ChatConversationRowTokenState>()

  if (state.isUnread) {
    states.add('unread')
  }

  if (state.isSelected) {
    states.add('selected')
  }

  return resolveConfigNode<ChatConversationRowTokens>(
    chatConversationRowTokens,
    {
      theme: themeTokens,
      state: states,
    }
  )
}
