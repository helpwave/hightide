import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../primitive-tokens'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokensNode } from '../component-tokens'
import type { ContainerTokens } from '../container-tokens'
import { elevationTokens } from './elevation-tokens'

export type CardState = ResolverState
export type CardConfig = HightideResolverConfig

export type CardTokens = AssertAssignable<
  ContainerTokens,
  ComponentTokensNode<CardConfig>
>

export type CardTokenResolver = ComponentTokenResolver<
  object,
  CardTokens
>

export const cardTokens = {
  type: 'container',
  backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.surface.color')),
  borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef('theme.borderRadius.lg') }),
  layout: TokenBuilder.stateful({
    direction: TokenBuilder.layoutDirection('vertical'),
    crossAxisAlignment: TokenBuilder.crossAxisAlignment('stretch'),
    mainAxisAlignment: TokenBuilder.mainAxisAlignment('start'),
    gap: TokenBuilder.numberValue(TokenBuilder.number(0)),
  }),
  shadow: TokenBuilder.stateful(elevationTokens('level2')),
} as const
