import { hightideChatAttachmentCardTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { ChatMessageDirection } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatAttachmentCardIconColor,
  ChatAttachmentCardIconStyle,
  ChatAttachmentCardMetadataStyle,
  ChatAttachmentCardNameStyle,
  ChatAttachmentCardState,
  ChatAttachmentCardStyle,
  ChatAttachmentCardTheme
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver
} from '../../types/resolver'

export const toAttachmentCardTheme = (themeTokens: ThemeTokens): ChatAttachmentCardTheme => {
  const resolve = (direction?: ChatMessageDirection) => hightideChatAttachmentCardTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
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
