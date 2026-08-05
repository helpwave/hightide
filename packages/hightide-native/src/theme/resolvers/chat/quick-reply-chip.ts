import { hightideChatQuickReplyChipTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatQuickReplyChipState,
  ChatQuickReplyChipStyle,
  ChatQuickReplyChipTextStyle,
  ChatQuickReplyChipTheme
} from '../../types/components/chat'
import { createStyleResolver } from '../../types/resolver'

export const toQuickReplyChipTheme = (themeTokens: ThemeTokens): ChatQuickReplyChipTheme => {
  const resolve = (state: ChatQuickReplyChipState) => hightideChatQuickReplyChipTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
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
