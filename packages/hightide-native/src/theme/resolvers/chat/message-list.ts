import type {
  ChatMessageListStyle,
  ChatMessageListThemeResolvers
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

import { StyleAdapterUtils } from '../../adapters'

export const toChatMessageListThemeResolvers: ComponentThemeResolver<ChatMessageListThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = () => componentTokens.chat.messageList({
    themeTokens,
    semanticResolvers: semanticTokens,
  })

  return {
    container: createSimpleStyleResolver((): ChatMessageListStyle => ({
      ...StyleAdapterUtils.container(resolve().container),
      flex: 1,
    })),
  }
}
