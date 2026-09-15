import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverParams, HightideResolverConfig, ResolverState } from '../../primitive-tokens'
import type { NumberValueToken } from '../../primitive-tokens/number-value-token'
import type { IconSize } from '../../theme-tokens/create'
import type { ResolvableIconTokens } from '../resolvable-icon-tokens'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { HightideTokenPathProvider } from './token-context'

export type { IconTokens } from '../icon-tokens'
export type { ResolvableIconTokens } from '../resolvable-icon-tokens'

export type IconParams = AssertAssignable<{
  numbers: {
    iconSize: NumberValueToken,
  },
}, HightideResolverParams>
export type IconTokenContext = HightideTokenPathProvider<IconParams>

export type IconState = ResolverState
export type IconConfig = HightideResolverConfig

export type IconComponentResolverProps = {
  overrides: {
    size?: IconSize,
  },
}

export type IconTokenConfig<
  S extends ResolverState = IconState,
  C extends HightideResolverConfig = IconConfig
> = ResolvableIconTokens<S, C>

export type IconTokenResolver = ComponentTokenResolver<
  IconComponentResolverProps,
  ResolvableIconTokens<IconState, IconConfig>
>

export const iconTokens = {
  type: 'icon',
  size: TokenBuilder.stateful(TokenBuilder.numberRef<IconTokenContext>(
    'params.numbers.iconSize',
    TokenBuilder.numberRef<IconTokenContext>('theme.icongraphy.sizes.md')
  )),
  strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<IconTokenContext>('theme.icongraphy.strokeWidth')),
  color: TokenBuilder.stateful(
    TokenBuilder.colorValueRef<IconTokenContext>(
      'semantics.color.coloring.foreground',
      TokenBuilder.colorValueRef<IconTokenContext>('theme.color.background.onColor')
    )
  ),
} as const
