import type { ChatMessageDirection } from '@helpwave/hightide-design/component-token-resolvers'

import { toContainerStyle, toTextStyle } from '../../adapters/style-adapters'
import type {
  ChatAttachmentCardIconColor,
  ChatAttachmentCardIconStyle,
  ChatAttachmentCardMetadataStyle,
  ChatAttachmentCardNameStyle,
  ChatAttachmentCardState,
  ChatAttachmentCardStyle,
  ChatAttachmentCardThemeResolvers
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

export const toChatAttachmentCardThemeResolvers: ComponentThemeResolver<ChatAttachmentCardThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (direction?: ChatMessageDirection) => componentTokens.chat.attachmentCard({
    themeTokens,
    semanticResolvers: semanticTokens,
    config: { direction },
  })

  return {
    container: createStyleResolver((state: ChatAttachmentCardState): ChatAttachmentCardStyle => (
      toContainerStyle(resolve(state.direction).container)
    )),
    icon: createSimpleStyleResolver((): ChatAttachmentCardIconStyle => (
      toContainerStyle(resolve().icon)
    )),
    iconColor: createSimpleValueResolver((): ChatAttachmentCardIconColor => ({
      color: resolve().iconColor.color,
    })),
    name: createSimpleStyleResolver((): ChatAttachmentCardNameStyle => (
      toTextStyle(resolve().name)
    )),
    metadata: createSimpleStyleResolver((): ChatAttachmentCardMetadataStyle => (
      toTextStyle(resolve().metadata)
    )),
  }
}
