import { TokenBuilder } from '../../../utils'
import type { AssertAssignable } from '../../../primitive-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ContainerTokens } from '../../container-tokens'
import type { IconTokens } from '../../icon-tokens'
import type { TextTokens } from '../../text-tokens'
import type {
  PressableComponentResolverProps,
  PressableTokens
} from '../pressable-tokens'
import {
  type ChatMessageBubbleState,
  type ChatMessageBubbleConfig,
  type ChatMessageBubbleTokens
} from './message-bubble'
import {
  type ChatMessageDirection
} from './shared'

export type ChatAttachmentMessageBubbleState = ChatMessageBubbleState
export type ChatAttachmentMessageBubbleConfig = ChatMessageBubbleConfig

export type ChatAttachmentMessageBubbleResolverProps = {
  config: {
    direction?: ChatMessageDirection,
  },
}

export type ChatAttachmentMessageBubbleTokens = AssertAssignable<{
  fileIconContainer: ContainerTokens,
  fileIcon: IconTokens,
  downloadIconContainer: ContainerTokens,
  downloadIcon: IconTokens,
  fileNameText: TextTokens,
  fileMetadataText: TextTokens,
}, ComponentTokens<ChatAttachmentMessageBubbleState, ChatAttachmentMessageBubbleConfig>> & {
  chatMessageBubbleOverrides: Partial<ChatMessageBubbleTokens>,
  contentContainer: {
    config: Partial<PressableComponentResolverProps['overrides']>,
  } & Partial<PressableTokens>,
}

export type ChatAttachmentMessageBubbleTokenResolver = ComponentTokenResolver<
  ChatAttachmentMessageBubbleResolverProps,
  ChatAttachmentMessageBubbleTokens
>

export const chatAttachmentMessageBubbleTokens = {
  contentContainer: {
    container: {
      type: 'container',
      layout: TokenBuilder.stateful({
        direction: TokenBuilder.layoutDirection('horizontal'),
        crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
        gap: TokenBuilder.numberRef('theme.spacing.md'),
      }),
    },
  },
  fileIconContainer: {
    backgroundColor: TokenBuilder.stateful(
      TokenBuilder.colorOpacity(
        TokenBuilder.colorValueRef('theme.color.negative.color'),
        TokenBuilder.numberValue(TokenBuilder.number(0.2))
      )
    ),
    size: TokenBuilder.stateful({
      width: TokenBuilder.numberRef('theme.size.md'),
      height: TokenBuilder.numberRef('theme.size.md'),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef('theme.borderRadius.sm') }),
    layout: TokenBuilder.stateful({
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('center'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
  },
  fileIcon: {
    size: TokenBuilder.stateful(TokenBuilder.numberRef('theme.icongraphy.sizes.md')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef('theme.icongraphy.strokeWidth')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.negative.color')),
  },
  downloadIconContainer: {
    size: TokenBuilder.stateful({
      width: TokenBuilder.numberRef('theme.size.sm'),
      height: TokenBuilder.numberRef('theme.size.sm'),
    }),
    layout: TokenBuilder.stateful({
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('center'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
  },
  downloadIcon: {
    size: TokenBuilder.stateful(TokenBuilder.numberRef('theme.icongraphy.sizes.sm')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef('theme.icongraphy.strokeWidth')),
  },
  fileNameText: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.medium')),
  },
  fileMetadataText: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontWeight')),
  },
} as const
