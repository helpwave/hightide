import {
  chatThreadHeaderTokens,
  type ChatThreadHeaderTokenResolver,
  type ChatThreadHeaderTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '@helpwave/hightide-design/component-tokens'

export const chatThreadHeaderTokenResolver: ChatThreadHeaderTokenResolver = ({
  themeTokens,
}) => (
  resolveConfigNode<ChatThreadHeaderTokens>(
    chatThreadHeaderTokens,
    {
      theme: themeTokens,
      state: new Set(),
    }
  )
)
