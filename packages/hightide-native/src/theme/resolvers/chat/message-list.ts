import { toContainerStyle } from '../../adapters/style-adapters'
import type {
  ChatMessageListStyle,
  ChatMessageListThemeResolvers
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

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
      ...toContainerStyle(resolve().container),
      flex: 1,
    })),
  }
}
