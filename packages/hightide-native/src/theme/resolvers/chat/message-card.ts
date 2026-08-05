import type {
  ChatMessageCardActionsStyle,
  ChatMessageCardBodyStyle,
  ChatMessageCardHeaderStyle,
  ChatMessageCardIconColor,
  ChatMessageCardIconStyle,
  ChatMessageCardState,
  ChatMessageCardStyle,
  ChatMessageCardSubtitleStyle,
  ChatMessageCardThemeResolvers,
  ChatMessageCardTitleStyle
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

export const toChatMessageCardThemeResolvers: ComponentThemeResolver<ChatMessageCardThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state?: Partial<ChatMessageCardState>) => componentTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
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
