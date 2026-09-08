import {
  chatQuickReplyChipTokens,
  type ChatQuickReplyChipTokenResolver,
  type ChatQuickReplyChipTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '../../static-resolve/resolve'

type ChatQuickReplyChipTokenState = 'active'

export const chatQuickReplyChipTokenResolver: ChatQuickReplyChipTokenResolver = ({
  themeTokens,
  config,
}) => {
  const states = new Set<ChatQuickReplyChipTokenState>()

  if (config.isActive) {
    states.add('active')
  }

  const resolved = resolveConfigNode<Omit<ChatQuickReplyChipTokens, 'config'> & {
    config: Omit<ChatQuickReplyChipTokens['config'], 'color'>,
  }>(
    chatQuickReplyChipTokens,
    {
      theme: themeTokens,
      state: states,
    }
  )

  return {
    ...resolved,
    config: {
      ...resolved.config,
      color: themeTokens.color.surface,
    },
  }
}
