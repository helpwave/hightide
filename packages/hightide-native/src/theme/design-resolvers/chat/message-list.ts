import {
  chatMessageListTokens,
  type ChatMessageListTokenResolver,
  type ChatMessageListTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../../static-resolve/resolve'

export const chatMessageListTokenResolver: ChatMessageListTokenResolver = ({
  themeTokens,
}) => (
  resolveTokenConfig<ChatMessageListTokens>(
    chatMessageListTokens,
    new Set(),
    {
      theme: themeTokens,
    }
  )
)
