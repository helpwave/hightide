import {
  chatMessageListTokens,
  type ChatMessageListTokenResolver,
  type ChatMessageListTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '@helpwave/hightide-design/component-tokens'

export const chatMessageListTokenResolver: ChatMessageListTokenResolver = ({
  themeTokens,
}) => (
  resolveConfigNode<ChatMessageListTokens>(
    chatMessageListTokens,
    {
      theme: themeTokens,
      state: new Set(),
    }
  )
)
