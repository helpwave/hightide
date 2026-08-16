import type { ChatMessageDirection } from '@helpwave/hightide-design/component-token-resolvers'

import { toContainerStyle } from '../../adapters/container-adapter'
import { toIconStyle } from '../../adapters/icon-style-adapter'
import { toTextStyle } from '../../adapters/text-style-adapter'
import type {
  ChatMessageBubbleBodyStyle,
  ChatMessageBubbleBodyTextStyle,
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleMetaDataContainerStyle,
  ChatMessageBubbleMetaDataIconStyle,
  ChatMessageBubbleMetaDataStatusContainerStyle,
  ChatMessageBubbleMetaDataTextStyle,
  ChatMessageBubbleState,
  ChatMessageBubbleThemeResolvers
} from '../../types/components/chat'
import {
  createStyleResolver,
  createValueResolver,
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
    body: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleBodyStyle => (
      toContainerStyle(resolve(state.direction).body)
    )),
    bodyText: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleBodyTextStyle => (
      toTextStyle(resolve(state.direction).bodyText)
    )),
    metaDataContainer: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleMetaDataContainerStyle => (
      toContainerStyle(resolve(state.direction).metaDataContainer)
    )),
    metaDataStatusContainer: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleMetaDataStatusContainerStyle => (
      toContainerStyle(resolve(state.direction).metaDataStatusContainer)
    )),
    metaDataText: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleMetaDataTextStyle => (
      toTextStyle(resolve(state.direction).metaDataText)
    )),
    metaDataIcon: createValueResolver((state: ChatMessageBubbleState): ChatMessageBubbleMetaDataIconStyle => (
      toIconStyle(resolve(state.direction).metaDataIcon)
    )),
  }
}
