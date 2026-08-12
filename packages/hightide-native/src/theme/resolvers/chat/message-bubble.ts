import type { ChatMessageDirection } from '@helpwave/hightide-design/component-token-resolvers'

import { toContainerStyle, toTextStyle } from '../../adapters/style-adapters'
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
  const resolve = (direction?: ChatMessageDirection) => componentTokens.chat.messageBubble({
    themeTokens,
    semanticResolvers: semanticTokens,
    config: { direction },
  })

  return {
    container: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleContainerStyle => (
      toContainerStyle(resolve(state.direction).container)
    )),
    bubble: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleStyle => (
      toContainerStyle(resolve(state.direction).bubble)
    )),
    content: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleContentStyle => (
      toTextStyle(resolve(state.direction).content)
    )),
    timestamp: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleTimestampStyle => (
      toTextStyle(resolve(state.direction).timestamp)
    )),
    receipt: createSimpleStyleResolver((): ChatMessageBubbleReceiptStyle => (
      toContainerStyle(resolve().receipt)
    )),
    receiptText: createSimpleStyleResolver((): ChatMessageBubbleReceiptTextStyle => (
      toTextStyle(resolve().receiptText)
    )),
    receiptIcon: createSimpleValueResolver((): ChatMessageBubbleReceiptIconStyle => ({
      color: resolve().receiptIcon.color,
    })),
  }
}
