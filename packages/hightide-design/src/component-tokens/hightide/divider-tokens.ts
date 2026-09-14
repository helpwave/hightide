import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorToken, HightideResolverConfig, NumberToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokensNode } from '../component-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import type { HightideTokenPathProvider } from './token-context'

export type DividerDirection = 'horizontal' | 'vertical'

export type DividerComponentResolverProps = {
  overrides?: {
    direction?: DividerDirection,
    color?: ColorToken,
    width?: number,
    margin?: number,
  },
}

export type DividerState = AssertAssignable<'vertical', ResolverState>
export type DividerConfig = HightideResolverConfig

export type DividerTokens = AssertAssignable<
  ResolvableContainerTokens<DividerState, DividerConfig>,
  ComponentTokensNode<DividerState, DividerConfig>
>

export type DividerParams = AssertAssignable<{
  colors: {
    color: ColorToken,
  },
  numbers: {
    width: NumberToken,
    margin: NumberToken,
  },
}, HightideResolverParams>
export type DividerTokenContext = HightideTokenPathProvider<DividerParams>

export type DividerTokenResolver = ComponentTokenResolver<
  DividerComponentResolverProps,
  DividerTokens
>

export const dividerTokens = {
  kind: 'container' as const,
  margin: TokenBuilder.margin(
    {
      horizontal: TokenBuilder.numberRef<DividerTokenContext>('params.numbers.margin'),
      vertical: TokenBuilder.numberRef<DividerTokenContext>('params.numbers.width'),
    },
    [
      TokenBuilder.whenState(['vertical'], TokenBuilder.sides({
        vertical: TokenBuilder.numberRef<DividerTokenContext>('params.numbers.margin'),
        horizontal: TokenBuilder.numberRef<DividerTokenContext>('params.numbers.width'),
      })),
    ]
  ),
  border: TokenBuilder.stateful(
    {
      width: TokenBuilder.sides({ bottom: TokenBuilder.numberRef<DividerTokenContext>('params.numbers.width') }),
      color: TokenBuilder.sides({ bottom: TokenBuilder.colorRef<DividerTokenContext>('params.colors.color') }),
      style: 'solid',
    },
    [
      TokenBuilder.whenState(['vertical'], {
        width: TokenBuilder.sides({ right: TokenBuilder.numberRef<DividerTokenContext>('params.numbers.width') }),
        color: TokenBuilder.sides({ right: TokenBuilder.colorRef<DividerTokenContext>('params.colors.color') }),
        style: 'solid',
      }),
    ]
  ),
  layout: TokenBuilder.stateful(
    {
      selfCrossAxisAlignment: 'stretch',
    },
    [
      TokenBuilder.whenState(['vertical'], {}),
    ]
  ),
} as const
