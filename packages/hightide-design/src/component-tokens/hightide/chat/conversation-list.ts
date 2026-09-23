import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ContainerTokens } from '../../container-tokens'

export type ChatConversationListState = ResolverState
export type ChatConversationListConfig = HightideResolverConfig

export type ChatConversationListTokens = AssertAssignable<{
  container: ContainerTokens,
  header: ContainerTokens,
  footer: ContainerTokens,
}, ComponentTokens<ChatConversationListState, ChatConversationListConfig>>

export type ChatConversationListTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatConversationListTokens
>

export const chatConversationListTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.surface.color')),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('vertical'),
    }),
  },
  header: {
    type: 'container',
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.spacing.lg'), horizontal: TokenBuilder.numberRef('theme.spacing.lg') }),
    layout: TokenBuilder.stateful({
      gap: TokenBuilder.numberRef('theme.padding.xl'),
    }),
  },
  footer: {
    type: 'container',
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.spacing.md'), horizontal: TokenBuilder.numberRef('theme.spacing.lg') }),
  },
} as const
