import {
  chatMessageBubbleTokens,
  type ChatMessageBubbleTokenResolver,
  type ChatMessageBubbleTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../../static-resolve/resolve'

type ChatMessageBubbleTokenState = 'outgoing'

export const chatMessageBubbleTokenResolver: ChatMessageBubbleTokenResolver = ({
  themeTokens,
  config,
}) => {
  const states = new Set<ChatMessageBubbleTokenState>()

  if (config.direction === 'outgoing') {
    states.add('outgoing')
  }

  return resolveTokenConfig<ChatMessageBubbleTokens>(
    chatMessageBubbleTokens,
    states,
    {
      theme: themeTokens,
    }
  )
}
