import { toContainerStyle } from '../../adapters/container-adapter'
import { toTextStyle } from '../../adapters/text-style-adapter'
import type { TextStyle } from 'react-native'
import type {
  ChatMessageComposerInputStyle,
  ChatMessageComposerStyle,
  ChatMessageComposerThemeResolvers
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

export const toChatMessageComposerThemeResolvers: ComponentThemeResolver<ChatMessageComposerThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = () => componentTokens.chat.messageComposer({
    themeTokens,
    semanticResolvers: semanticTokens,
  })

  return {
    container: createSimpleStyleResolver((): ChatMessageComposerStyle => (
      toContainerStyle(resolve().container)
    )),
    input: createSimpleStyleResolver((): ChatMessageComposerInputStyle => ({
      ...toContainerStyle(resolve().input),
      ...toTextStyle(resolve().text),
      flex: 1,
    })),
    placeholderColor: createSimpleValueResolver((): TextStyle => ({
      color: resolve().placeholder.color
    })),
  }
}
