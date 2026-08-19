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

import { StyleAdapterUtils } from '../../adapters'

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
      StyleAdapterUtils.container(resolve().container)
    )),
    input: createSimpleStyleResolver((): ChatMessageComposerInputStyle => ({
      ...StyleAdapterUtils.container(resolve().input),
      ...StyleAdapterUtils.text(resolve().text),
    })),
    placeholderColor: createSimpleValueResolver((): TextStyle => ({
      color: resolve().placeholder.color
    })),
  }
}
