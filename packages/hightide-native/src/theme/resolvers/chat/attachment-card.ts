import type { ChatMessageDirection } from '@helpwave/hightide-design/component-token-resolvers'

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
  const resolve = (direction?: ChatMessageDirection) => componentTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
    config: { direction },
  })

  return {
    container: createStyleResolver((state: ChatAttachmentCardState): ChatAttachmentCardStyle => ({
      ...resolve(state.direction).container,
    })),
    icon: createSimpleStyleResolver((): ChatAttachmentCardIconStyle => ({
      ...resolve().icon,
    })),
    iconColor: createSimpleValueResolver((): ChatAttachmentCardIconColor => ({
      color: resolve().iconColor.color,
    })),
    name: createSimpleStyleResolver((): ChatAttachmentCardNameStyle => ({
      ...resolve().name,
    })),
    metadata: createSimpleStyleResolver((): ChatAttachmentCardMetadataStyle => ({
      ...resolve().metadata,
    })),
  }
}
