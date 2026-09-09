import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type {
  PressableComponentResolverProps,
  PressableTokens
} from '../pressable-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import type { ComponentTokenConfig } from '../token-config'
import {
  type ChatMessageBubbleTokens
} from './message-bubble'
import {
  type ChatMessageDirection
} from './shared'
import {
  stateful,
  tokenColorOpacity,
  tokenVariable,
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
        gap: tokenVariable('theme.spacing.md'),
      }),
    },
  },
  fileIconContainer: {
    backgroundColor: stateful(
      tokenColorOpacity(
        tokenVariable('theme.color.negative.color'),
        tokenValue(0.2)
      )
    ),
    size: stateful({
      width: tokenVariable('theme.size.md'),
      height: tokenVariable('theme.size.md'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenVariable('theme.borderRadius.sm'),
    }),
    layout: stateful({
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
  },
  fileIcon: {
    size: stateful(tokenVariable('theme.icongraphy.sizes.md')),
    strokeWidth: stateful(tokenVariable('theme.icongraphy.strokeWidth')),
    color: stateful(tokenVariable('theme.color.negative.color')),
  },
  downloadIconContainer: {
    size: stateful({
      width: tokenVariable('theme.size.sm'),
      height: tokenVariable('theme.size.sm'),
    }),
    layout: stateful({
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
  },
  downloadIcon: {
    size: stateful(tokenVariable('theme.icongraphy.sizes.sm')),
    strokeWidth: stateful(tokenVariable('theme.icongraphy.strokeWidth')),
  },
  fileNameText: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.medium')),
  },
  fileMetadataText: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.typography.body.sm.fontWeight')),
  },
} as const satisfies ComponentTokenConfig<ChatAttachmentMessageBubbleTokens>
