import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'

export type ChatMessageListState = ResolverState
export type ChatMessageListConfig = HightideResolverConfig

export type ChatMessageListTokens = AssertAssignable<{
  container: ResolvableContainerTokens<ChatMessageListState, ChatMessageListConfig>,
}, ComponentTokens<ChatMessageListState, ChatMessageListConfig>>

export type ChatMessageListTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatMessageListTokens
>

export const chatMessageListTokens = {
  container: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.background.color')),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.calc(
        'add',
        TokenBuilder.numberRef('theme.spacing.lg'),
        TokenBuilder.numberRef('theme.spacing.xs')
      ), horizontal: TokenBuilder.numberRef('theme.spacing.lg') }),
    layout: TokenBuilder.stateful({
      gap: TokenBuilder.numberRef('theme.padding.xl'),
    }),
  },
} as const
