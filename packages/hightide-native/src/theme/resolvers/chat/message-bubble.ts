import type { ChatMessageDirection } from '@helpwave/hightide-design/component-token-resolvers'

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
  type ComponentThemeResolver
} from '../../types/resolver'

import { StyleAdapterUtils } from '../../adapters'

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
      StyleAdapterUtils.container(resolve(state.direction).container)
    )),
    body: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleBodyStyle => (
      StyleAdapterUtils.container(resolve(state.direction).body)
    )),
    bodyText: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleBodyTextStyle => (
      StyleAdapterUtils.text(resolve(state.direction).bodyText)
    )),
    metaDataContainer: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleMetaDataContainerStyle => (
      StyleAdapterUtils.container(resolve(state.direction).metaDataContainer)
    )),
    metaDataStatusContainer: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleMetaDataStatusContainerStyle => (
      StyleAdapterUtils.container(resolve(state.direction).metaDataStatusContainer)
    )),
    metaDataText: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleMetaDataTextStyle => (
      StyleAdapterUtils.text(resolve(state.direction).metaDataText)
    )),
    metaDataIcon: createStyleResolver((state: ChatMessageBubbleState): ChatMessageBubbleMetaDataIconStyle => (
      StyleAdapterUtils.icon(resolve(state.direction).metaDataIcon)
    )),
  }
}
