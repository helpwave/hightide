import type { ChatMessageDirection } from '@helpwave/hightide-design/component-token-resolvers'

import type {
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleContentStyle,
  ChatMessageBubbleReceiptIconStyle,
  ChatMessageBubbleReceiptStyle,
  ChatMessageBubbleReceiptTextStyle,
  ChatMessageBubbleState,
  ChatMessageBubbleStyle,
  ChatMessageBubbleThemeResolvers,
  ChatMessageBubbleTimestampStyle
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

export const toChatMessageBubbleThemeResolvers: ComponentThemeResolver<ChatMessageBubbleThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (direction?: ChatMessageDirection) => componentTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
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
