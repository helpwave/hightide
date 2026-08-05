import { hightideChatThreadHeaderTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatThreadHeaderStyle,
  ChatThreadHeaderSubtitleStyle,
  ChatThreadHeaderTheme,
  ChatThreadHeaderTitleStyle
} from '../../types/components/chat'
import { createSimpleStyleResolver } from '../../types/resolver'

export const toThreadHeaderTheme = (themeTokens: ThemeTokens): ChatThreadHeaderTheme => {
  const resolve = () => hightideChatThreadHeaderTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
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
