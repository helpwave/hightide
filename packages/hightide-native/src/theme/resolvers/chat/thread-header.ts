import type {
  ChatThreadHeaderStyle,
  ChatThreadHeaderSubtitleStyle,
  ChatThreadHeaderThemeResolvers,
  ChatThreadHeaderTitleStyle
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

export const toChatThreadHeaderThemeResolvers: ComponentThemeResolver<ChatThreadHeaderThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = () => componentTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
  })

  return {
    container: createSimpleStyleResolver((): ChatThreadHeaderStyle => ({
      ...resolve().container,
    })),
    title: createSimpleStyleResolver((): ChatThreadHeaderTitleStyle => ({
      ...resolve().title,
    })),
    subtitle: createSimpleStyleResolver((): ChatThreadHeaderSubtitleStyle => ({
      ...resolve().subtitle,
    })),
  }
}
