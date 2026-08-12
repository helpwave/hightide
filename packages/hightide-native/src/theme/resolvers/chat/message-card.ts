import { toContainerStyle, toTextStyle } from '../../adapters/style-adapters'
import type {
  ChatMessageCardActionsStyle,
  ChatMessageCardBodyStyle,
  ChatMessageCardHeaderStyle,
  ChatMessageCardIcon,
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
  const resolve = (state?: Partial<ChatMessageCardState>) => componentTokens.chat.messageCard({
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
    container: createStyleResolver((state: ChatMessageCardState): ChatMessageCardStyle => (
      toContainerStyle(resolve(state).container)
    )),
    header: createSimpleStyleResolver((): ChatMessageCardHeaderStyle => (
      toContainerStyle(resolve().header)
    )),
    icon: createStyleResolver((state: ChatMessageCardState): ChatMessageCardIconStyle => (
      toContainerStyle(resolve(state).icon)
    )),
    iconColor: createValueResolver((state: ChatMessageCardState): ChatMessageCardIcon => ({
      color: resolve(state).iconColor.color,
    })),
    title: createStyleResolver((state: ChatMessageCardState): ChatMessageCardTitleStyle => (
      toTextStyle(resolve(state).title)
    )),
    subtitle: createSimpleStyleResolver((): ChatMessageCardSubtitleStyle => (
      toTextStyle(resolve().subtitle)
    )),
    body: createSimpleStyleResolver((): ChatMessageCardBodyStyle => (
      toContainerStyle(resolve().body)
    )),
    actions: createSimpleStyleResolver((): ChatMessageCardActionsStyle => (
      toContainerStyle(resolve().actions)
    )),
  }
}
