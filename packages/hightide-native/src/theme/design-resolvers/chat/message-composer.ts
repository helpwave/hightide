import {
  chatMessageComposerTokens,
  type ChatMessageComposerTokenResolver,
  type ChatMessageComposerTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '../../static-resolve/resolve'

export const chatMessageComposerTokenResolver: ChatMessageComposerTokenResolver = ({
  themeTokens,
}) => (
  resolveConfigNode<ChatMessageComposerTokens>(
    chatMessageComposerTokens,
    {
      theme: themeTokens,
      state: new Set(),
    }
  )
)
