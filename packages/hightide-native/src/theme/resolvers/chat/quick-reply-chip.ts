import type {
  ChatQuickReplyChipState,
  ChatQuickReplyChipStyle,
  ChatQuickReplyChipTextStyle,
  ChatQuickReplyChipThemeResolvers
} from '../../types/components/chat'
import {
  createStyleResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

export const toChatQuickReplyChipThemeResolvers: ComponentThemeResolver<ChatQuickReplyChipThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: ChatQuickReplyChipState) => componentTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
    state: {
      isPressed: state.isPressed,
      isDisabled: state.isDisabled,
      isActive: state.isActive,
    },
  })

  return {
    container: createStyleResolver((state: ChatQuickReplyChipState): ChatQuickReplyChipStyle => ({
      ...resolve(state).container,
    })),
    text: createStyleResolver((state: ChatQuickReplyChipState): ChatQuickReplyChipTextStyle => ({
      ...resolve(state).text,
    })),
  }
}
