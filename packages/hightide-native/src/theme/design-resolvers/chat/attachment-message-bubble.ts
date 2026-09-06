import {
  chatAttachmentMessageBubbleTokens,
  type ChatAttachmentMessageBubbleTokenResolver,
  type ChatAttachmentMessageBubbleTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../../static-resolve/resolve'

type ChatAttachmentTokenState = 'outgoing'

export const chatAttachmentMessageBubbleTokenResolver: ChatAttachmentMessageBubbleTokenResolver = ({
  themeTokens,
  config,
}) => {
  const states = new Set<ChatAttachmentTokenState>()

  if (config.direction === 'outgoing') {
    states.add('outgoing')
  }

  const resolved = resolveTokenConfig<Omit<ChatAttachmentMessageBubbleTokens, 'chatMessageBubbleOverrides' | 'contentContainer'> & {
    contentContainer: Pick<ChatAttachmentMessageBubbleTokens['contentContainer'], 'container'>,
  }>(
    chatAttachmentMessageBubbleTokens,
    states,
    {
      theme: themeTokens,
    }
  )

  return {
    chatMessageBubbleOverrides: {},
    contentContainer: {
      config: {
        coloringStyle: 'filled',
        coloringColorVariant: 'tonal',
        color: config.direction === 'outgoing'
          ? themeTokens.color.primary
          : themeTokens.color.neutral,
      },
      container: resolved.contentContainer.container,
    },
    fileIconContainer: resolved.fileIconContainer,
    fileIcon: resolved.fileIcon,
    downloadIconContainer: resolved.downloadIconContainer,
    downloadIcon: resolved.downloadIcon,
    fileNameText: resolved.fileNameText,
    fileMetadataText: resolved.fileMetadataText,
  }
}
