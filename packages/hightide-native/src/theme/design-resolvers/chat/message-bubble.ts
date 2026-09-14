import {
  chatMessageBubbleTokens,
  type ChatMessageBubbleTokenResolver,
  type ChatMessageBubbleTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '@helpwave/hightide-design/component-tokens'

type ChatMessageBubbleTokenState = 'outgoing'

export const chatMessageBubbleTokenResolver: ChatMessageBubbleTokenResolver = ({
  themeTokens,
  config,
}) => {
  const states = new Set<ChatMessageBubbleTokenState>()

  if (config.direction === 'outgoing') {
    states.add('outgoing')
  }

  return resolveConfigNode<ChatMessageBubbleTokens>(
    chatMessageBubbleTokens,
    {
      theme: themeTokens,
      state: states,
    }
  )
}
