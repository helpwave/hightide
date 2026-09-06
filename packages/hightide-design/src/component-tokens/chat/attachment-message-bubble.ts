import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type {
  PressableComponentResolverProps,
  PressableTokens
} from '../pressable-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  type ChatMessageBubbleTokens
} from './message-bubble'
import {
  type ChatMessageDirection
} from './shared'
import {
  stateful,
  tokenColorOpacity,
  tokenPath,
  tokenValue
} from '../builders'

export type ChatAttachmentMessageBubbleResolverProps = {
  config: {
    direction?: ChatMessageDirection,
  },
}

export type ChatAttachmentMessageBubbleTokens = {
  chatMessageBubbleOverrides: Partial<ChatMessageBubbleTokens>,
  contentContainer: {
    config: Partial<PressableComponentResolverProps['overrides']>,
  } & Partial<PressableTokens>,
  fileIconContainer: ContainerTokens,
  fileIcon: IconTokens,
  downloadIconContainer: ContainerTokens,
  downloadIcon: IconTokens,
  fileNameText: TextStyleTokens,
  fileMetadataText: TextStyleTokens,
}

export type ChatAttachmentMessageBubbleTokenResolver = ComponentTokenResolver<
  ChatAttachmentMessageBubbleResolverProps,
  ChatAttachmentMessageBubbleTokens
>

export const chatAttachmentMessageBubbleTokens = {
  contentContainer: {
    container: {
      layout: stateful({
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        gap: tokenPath('theme.spacing.md'),
      }),
    },
  },
  fileIconContainer: {
    backgroundColor: stateful(
      tokenColorOpacity(
        tokenPath('theme.color.negative.color'),
        tokenValue(0.2)
      )
    ),
    size: stateful({
      width: tokenPath('theme.size.md'),
      height: tokenPath('theme.size.md'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenPath('theme.borderRadius.sm'),
    }),
    layout: stateful({
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
  },
  fileIcon: {
    size: stateful(tokenPath('theme.icongraphy.sizes.md')),
    strokeWidth: stateful(tokenPath('theme.icongraphy.strokeWidth')),
    color: stateful(tokenPath('theme.color.negative.color')),
  },
  downloadIconContainer: {
    size: stateful({
      width: tokenPath('theme.size.sm'),
      height: tokenPath('theme.size.sm'),
    }),
    layout: stateful({
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
  },
  downloadIcon: {
    size: stateful(tokenPath('theme.icongraphy.sizes.sm')),
    strokeWidth: stateful(tokenPath('theme.icongraphy.strokeWidth')),
  },
  fileNameText: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenPath('theme.fontWeights.medium')),
  },
  fileMetadataText: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenPath('theme.typography.body.sm.fontWeight')),
  },
} as const
