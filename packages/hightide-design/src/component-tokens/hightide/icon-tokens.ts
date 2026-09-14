import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverParams, HightideResolverConfig, ResolverState } from '../../primitive-tokens'
import type { NumberToken } from '../../primitive-tokens/number-token'
import type { IconSize } from '../../theme-tokens/create'
import type { ResolvableIconTokens } from '../resolvable-icon-tokens'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { HightideTokenPathProvider } from './token-context'
import type { IconTokens } from '../icon-tokens'

export type { IconTokens } from '../icon-tokens'
export type { ResolvableIconTokens } from '../resolvable-icon-tokens'

export type IconParams = AssertAssignable<{
  numbers: {
    iconSize: NumberToken,
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
  kind: 'icon' as const,
  size: TokenBuilder.stateful(TokenBuilder.numberRef<IconTokenContext>(
    'params.numbers.iconSize',
    TokenBuilder.numberRef<IconTokenContext>('theme.icongraphy.sizes.md')
  )),
  strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<IconTokenContext>('theme.icongraphy.strokeWidth')),
  color: TokenBuilder.stateful(
    TokenBuilder.colorRef<IconTokenContext>(
      'semantics.color.coloring.foreground',
      TokenBuilder.colorRef<IconTokenContext>('theme.color.background.onColor')
    )
  ),
}
