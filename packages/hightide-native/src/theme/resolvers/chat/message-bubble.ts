import { hightideChatMessageBubbleTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { ChatMessageDirection } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleContentStyle,
  ChatMessageBubbleReceiptIconStyle,
  ChatMessageBubbleReceiptStyle,
  ChatMessageBubbleReceiptTextStyle,
  ChatMessageBubbleState,
  ChatMessageBubbleStyle,
  ChatMessageBubbleTheme,
  ChatMessageBubbleTimestampStyle
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver
} from '../../types/resolver'

export const toMessageBubbleTheme = (themeTokens: ThemeTokens): ChatMessageBubbleTheme => {
  const resolve = (direction?: ChatMessageDirection) => hightideChatMessageBubbleTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    config: { direction },
  })

  return {
    container: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleContainerStyle => ({
      ...resolve(state.direction).container,
    })),
    bubble: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleStyle => ({
      ...resolve(state.direction).bubble,
    })),
    content: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleContentStyle => ({
      ...resolve(state.direction).content,
    })),
    timestamp: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleTimestampStyle => ({
      ...resolve(state.direction).timestamp,
    })),
    receipt: createSimpleStyleResolver((): ChatMessageBubbleReceiptStyle => ({
      ...resolve().receipt,
    })),
    receiptText: createSimpleStyleResolver((): ChatMessageBubbleReceiptTextStyle => ({
      ...resolve().receiptText,
    })),
    receiptIcon: createSimpleValueResolver((): ChatMessageBubbleReceiptIconStyle => ({
      color: resolve().receiptIcon.color,
    })),
  }
}
