import type { Color } from '../../types/color'
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
  const resolve = () => componentTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
  })

  return {
    container: createSimpleStyleResolver((): ChatMessageComposerStyle => ({
      ...resolve().container,
    })),
    input: createSimpleStyleResolver((): ChatMessageComposerInputStyle => ({
      ...resolve().input,
    })),
    placeholderColor: createSimpleValueResolver((): Color => (
      resolve().placeholderColor
    )),
  }
}
