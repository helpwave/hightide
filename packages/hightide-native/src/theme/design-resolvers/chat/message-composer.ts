import {
  chatMessageComposerTokens,
  type ChatMessageComposerTokenResolver,
  type ChatMessageComposerTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../../static-resolve/resolve'

export const chatMessageComposerTokenResolver: ChatMessageComposerTokenResolver = ({
  themeTokens,
}) => (
  resolveTokenConfig<ChatMessageComposerTokens>(
    chatMessageComposerTokens,
    new Set(),
    {
      theme: themeTokens,
    }
  )
)
