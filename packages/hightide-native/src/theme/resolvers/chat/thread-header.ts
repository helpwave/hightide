import { toContainerStyle, toTextStyle } from '../../adapters/style-adapters'
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
  const resolve = () => componentTokens.chat.threadHeader({
    themeTokens,
    semanticResolvers: semanticTokens,
  })

  return {
    container: createSimpleStyleResolver((): ChatThreadHeaderStyle => (
      toContainerStyle(resolve().container)
    )),
    title: createSimpleStyleResolver((): ChatThreadHeaderTitleStyle => (
      toTextStyle(resolve().title)
    )),
    subtitle: createSimpleStyleResolver((): ChatThreadHeaderSubtitleStyle => (
      toTextStyle(resolve().subtitle)
    )),
  }
}
