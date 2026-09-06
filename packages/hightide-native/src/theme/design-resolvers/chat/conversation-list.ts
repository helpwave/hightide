import {
  chatConversationListTokens,
  type ChatConversationListTokenResolver,
  type ChatConversationListTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../../static-resolve/resolve'

export const chatConversationListTokenResolver: ChatConversationListTokenResolver = ({
  themeTokens,
}) => (
  resolveTokenConfig<ChatConversationListTokens>(
    chatConversationListTokens,
    new Set(),
    {
      theme: themeTokens,
    }
  )
)
