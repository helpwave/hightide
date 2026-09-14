import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../primitive-tokens'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokensNode } from '../component-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import { elevationTokens } from './elevation-tokens'

export type CardState = ResolverState
export type CardConfig = HightideResolverConfig

export type CardTokens = AssertAssignable<
  ResolvableContainerTokens<CardState, CardConfig>,
  ComponentTokensNode<CardState, CardConfig>
>

export type CardTokenResolver = ComponentTokenResolver<
  object,
  CardTokens
>

export const cardTokens = {
  kind: 'container' as const,
  backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.surface.color')),
  borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef('theme.borderRadius.lg') }),
  layout: TokenBuilder.stateful({
    direction: 'vertical',
    crossAxisAlignment: 'stretch',
    mainAxisAlignment: 'start',
    gap: TokenBuilder.number(0),
  }),
  shadow: TokenBuilder.stateful(elevationTokens('level2')),
} as const
