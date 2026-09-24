import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, NumberValueToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokensNode } from '../component-tokens'
import type { ContainerTokens } from '../container-tokens'
import type { HightideTokenPathProvider } from './token-context'

export type DividerDirection = 'horizontal' | 'vertical'

export type DividerComponentResolverProps = {
  overrides?: {
    direction?: DividerDirection,
    color?: ColorValueToken,
    width?: number,
    margin?: number,
  },
}

export type DividerState = AssertAssignable<'vertical', ResolverState>
export type DividerConfig = HightideResolverConfig

export type DividerTokens = AssertAssignable<
  ContainerTokens,
  ComponentTokensNode<DividerConfig>
>

export type DividerParams = AssertAssignable<{
  colors: {
    color: ColorValueToken,
  },
  numbers: {
    width: NumberValueToken,
    margin: NumberValueToken,
  },
}, HightideResolverParams>
export type DividerTokenContext = HightideTokenPathProvider<DividerParams>

export type DividerTokenResolver = ComponentTokenResolver<
  DividerComponentResolverProps,
  DividerTokens
>

export const dividerTokens = {
  type: 'container',
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
      color: TokenBuilder.sides({ bottom: TokenBuilder.colorValueRef<DividerTokenContext>('params.colors.color') }),
      style: TokenBuilder.borderStyle('solid'),
    },
    [
      TokenBuilder.whenState(['vertical'], {
        width: TokenBuilder.sides({ right: TokenBuilder.numberRef<DividerTokenContext>('params.numbers.width') }),
        color: TokenBuilder.sides({ right: TokenBuilder.colorValueRef<DividerTokenContext>('params.colors.color') }),
        style: TokenBuilder.borderStyle('solid'),
      }),
    ]
  ),
  layout: TokenBuilder.stateful(
    {
      selfCrossAxisAlignment: TokenBuilder.crossAxisAlignment('stretch'),
    },
    [
      TokenBuilder.whenState(['vertical'], {
        selfCrossAxisAlignment: TokenBuilder.crossAxisAlignment('stretch'),
      }),
    ]
  ),
} as const
