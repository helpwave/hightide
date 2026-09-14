import {
  chatConversationListTokens,
  type ChatConversationListTokenResolver,
  type ChatConversationListTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '@helpwave/hightide-design/component-tokens'

export const chatConversationListTokenResolver: ChatConversationListTokenResolver = ({
  themeTokens,
}) => (
  resolveConfigNode<ChatConversationListTokens>(
    chatConversationListTokens,
    {
      theme: themeTokens,
      state: new Set(),
    }
  )
)
