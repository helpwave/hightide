import type { IconStyle } from '../../../icons'
import { toContainerStyle, toTextStyle } from '../../adapters/style-adapters'
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
    placeholderColor: createSimpleValueResolver((): IconStyle => ({
      color: resolve().placeholder.color
    })),
  }
}
