import { hightideChatDateDividerTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatDateDividerStyle,
  ChatDateDividerTextStyle,
  ChatDateDividerTheme
} from '../../types/components/chat'
import { createSimpleStyleResolver } from '../../types/resolver'

export const toDateDividerTheme = (themeTokens: ThemeTokens): ChatDateDividerTheme => {
  const resolve = () => hightideChatDateDividerTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
  })

  return {
    container: createSimpleStyleResolver((): ChatDateDividerStyle => ({
      ...resolve().container,
    })),
    text: createSimpleStyleResolver((): ChatDateDividerTextStyle => ({
      ...resolve().text,
    })),
  }
}
