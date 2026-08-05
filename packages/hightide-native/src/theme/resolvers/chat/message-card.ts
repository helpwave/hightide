import { hightideChatMessageCardTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatMessageCardActionsStyle,
  ChatMessageCardBodyStyle,
  ChatMessageCardHeaderStyle,
  ChatMessageCardIconColor,
  ChatMessageCardIconStyle,
  ChatMessageCardState,
  ChatMessageCardStyle,
  ChatMessageCardSubtitleStyle,
  ChatMessageCardTheme,
  ChatMessageCardTitleStyle
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  createStyleResolver,
  createValueResolver
} from '../../types/resolver'

export const toMessageCardTheme = (themeTokens: ThemeTokens): ChatMessageCardTheme => {
  const resolve = (state?: Partial<ChatMessageCardState>) => hightideChatMessageCardTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    config: {
      direction: state?.direction,
    },
    overrides: {
      color: state?.color,
    },
  })

  return {
    container: createStyleResolver((state: ChatMessageCardState): ChatMessageCardStyle => ({
      ...resolve(state).container,
    })),
    header: createSimpleStyleResolver((): ChatMessageCardHeaderStyle => ({
      ...resolve().header,
    })),
    icon: createStyleResolver((state: ChatMessageCardState): ChatMessageCardIconStyle => ({
      ...resolve(state).icon,
    })),
    iconColor: createValueResolver((state: ChatMessageCardState): ChatMessageCardIconColor => ({
      color: resolve(state).iconColor.color,
    })),
    title: createStyleResolver((state: ChatMessageCardState): ChatMessageCardTitleStyle => ({
      ...resolve(state).title,
    })),
    subtitle: createSimpleStyleResolver((): ChatMessageCardSubtitleStyle => ({
      ...resolve().subtitle,
    })),
    body: createSimpleStyleResolver((): ChatMessageCardBodyStyle => ({
      ...resolve().body,
    })),
    actions: createSimpleStyleResolver((): ChatMessageCardActionsStyle => ({
      ...resolve().actions,
    })),
  }
}
