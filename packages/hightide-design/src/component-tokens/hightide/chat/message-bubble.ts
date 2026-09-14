import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import type { ColorToken } from '../../../primitive-tokens/color-token'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../../resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from '../../resolvable-text-style-tokens'
import { elevationTokens } from '../elevation-tokens'
import {
  messageCornersTokens,
  type ChatMessageDirection
} from './shared'

export type ChatMessageBubbleState = AssertAssignable<'outgoing', ResolverState>
export type ChatMessageBubbleConfig = HightideResolverConfig

export type ChatMessageBubbleComponentResolverProps = {
  config: {
    direction?: ChatMessageDirection,
  },
}

export type ChatMessageBubbleTokens = AssertAssignable<{
  container: ResolvableContainerTokens<ChatMessageBubbleState, ChatMessageBubbleConfig>,
  body: ResolvableContainerTokens<ChatMessageBubbleState, ChatMessageBubbleConfig>,
  bodyText: ResolvableTextStyleTokens<ChatMessageBubbleState, ChatMessageBubbleConfig>,
  metaDataContainer: ResolvableContainerTokens<ChatMessageBubbleState, ChatMessageBubbleConfig>,
  metaDataStatusContainer: ResolvableContainerTokens<ChatMessageBubbleState, ChatMessageBubbleConfig>,
  metaDataText: ResolvableTextStyleTokens<ChatMessageBubbleState, ChatMessageBubbleConfig>,
  metaDataIcon: ResolvableIconTokens<ChatMessageBubbleState, ChatMessageBubbleConfig>,
}, ComponentTokens<ChatMessageBubbleState, ChatMessageBubbleConfig>>

export type ChatMessageBubbleTokenResolver = ComponentTokenResolver<
  ChatMessageBubbleComponentResolverProps,
  ChatMessageBubbleTokens
>

const bubbleMaxWidth = TokenBuilder.calc(
  'multiply',
  TokenBuilder.numberRef('theme.size.md'),
  TokenBuilder.number(16)
)

const outgoingDescription = TokenBuilder.colorBlend(
  TokenBuilder.colorRef('theme.color.primary.color'),
  TokenBuilder.colorOpacity(
    TokenBuilder.colorRef('theme.color.primary.onColor'),
    TokenBuilder.numberRef('theme.config.appearancePercentages.subtle')
  )
)

const incomingDescription = TokenBuilder.colorBlend(
  TokenBuilder.colorRef('theme.color.surface.color'),
  TokenBuilder.colorOpacity(
    TokenBuilder.colorRef('theme.color.surface.onColor'),
    TokenBuilder.numberRef('theme.config.appearancePercentages.subtle')
  )
)

export const chatMessageBubbleTokens = {
  container: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.statefulField<ColorToken>(
      TokenBuilder.colorRef('theme.color.surface.color'),
      [
        TokenBuilder.whenState(['outgoing'], TokenBuilder.colorRef('theme.color.primary.color')),
      ]
    ),
    size: TokenBuilder.stateful({
      maxWidth: bubbleMaxWidth,
    }),
    borderRadius: messageCornersTokens,
    padding: TokenBuilder.padding({ left: TokenBuilder.numberRef('theme.padding.xl'), right: TokenBuilder.numberRef('theme.padding.xl'), top: TokenBuilder.numberRef('theme.padding.lg'), bottom: TokenBuilder.numberRef('theme.padding.md') }),
    margin: TokenBuilder.margin({ inlineEnd: TokenBuilder.numberRef('theme.spacing.xxl') }, [
      TokenBuilder.whenState(['outgoing'], TokenBuilder.sides({ inlineStart: TokenBuilder.numberRef('theme.spacing.xxl') })),
    ]),
    layout: TokenBuilder.stateful({
      gap: TokenBuilder.numberRef('theme.spacing.sm'),
      direction: 'vertical',
      selfCrossAxisAlignment: 'start' as 'start' | 'end',
    }, [
      TokenBuilder.whenState(['outgoing'], {
        gap: TokenBuilder.numberRef('theme.spacing.sm'),
        direction: 'vertical',
        selfCrossAxisAlignment: 'end',
      }),
    ]),
    shadow: TokenBuilder.stateful(elevationTokens('level1')),
  },
  body: {
    layout: TokenBuilder.stateful({
      direction: 'vertical',
    }),
  },
  bodyText: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.light')),
    color: TokenBuilder.statefulField<ColorToken>(
      TokenBuilder.colorRef('theme.color.surface.onColor'),
      [
        TokenBuilder.whenState(['outgoing'], TokenBuilder.colorRef('theme.color.primary.onColor')),
      ]
    ),
  },
  metaDataContainer: {
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'end',
      crossAxisAlignment: 'center',
      gap: TokenBuilder.numberRef('theme.spacing.md'),
      selfCrossAxisAlignment: 'end',
    }),
  },
  metaDataStatusContainer: {
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: TokenBuilder.numberRef('theme.spacing.xs'),
    }),
  },
  metaDataText: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.medium')),
    color: TokenBuilder.statefulField<ColorToken>(incomingDescription, [
      TokenBuilder.whenState(['outgoing'], outgoingDescription),
    ]),
  },
  metaDataIcon: {
    size: TokenBuilder.stateful(TokenBuilder.numberRef('theme.icongraphy.sizes.xs')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef('theme.icongraphy.strokeWidth')),
    color: TokenBuilder.statefulField<ColorToken>(incomingDescription, [
      TokenBuilder.whenState(['outgoing'], outgoingDescription),
    ]),
  },
} as const
