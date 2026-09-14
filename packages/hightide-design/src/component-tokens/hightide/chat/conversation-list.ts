import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'

export type ChatConversationListState = ResolverState
export type ChatConversationListConfig = HightideResolverConfig

export type ChatConversationListTokens = AssertAssignable<{
  container: ResolvableContainerTokens<ChatConversationListState, ChatConversationListConfig>,
  header: ResolvableContainerTokens<ChatConversationListState, ChatConversationListConfig>,
  footer: ResolvableContainerTokens<ChatConversationListState, ChatConversationListConfig>,
}, ComponentTokens<ChatConversationListState, ChatConversationListConfig>>

export type ChatConversationListTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatConversationListTokens
>

export const chatConversationListTokens = {
  container: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.surface.color')),
    layout: TokenBuilder.stateful({
      direction: 'vertical',
    }),
  },
  header: {
    kind: 'container' as const,
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.spacing.lg'), horizontal: TokenBuilder.numberRef('theme.spacing.lg') }),
    layout: TokenBuilder.stateful({
      gap: TokenBuilder.numberRef('theme.padding.xl'),
    }),
  },
  footer: {
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.spacing.md'), horizontal: TokenBuilder.numberRef('theme.spacing.lg') }),
  },
} as const
