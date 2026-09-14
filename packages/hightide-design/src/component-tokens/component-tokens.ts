import type { ResolverConfig, ResolverState } from '../primitive-tokens'
import type { ResolvableContainerTokens } from './resolvable-container-tokens'
import type { ResolvableIconTokens } from './resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from './resolvable-text-style-tokens'

export type ComponentTokensNode<
  State extends ResolverState,
  Config extends ResolverConfig
> =
  | { readonly [key: string]: ComponentTokensNode<State, Config> }
  | ResolvableIconTokens<State, Config>
  | ResolvableContainerTokens<State, Config>
  | ResolvableTextStyleTokens<State, Config>

export type ComponentTokens<
  State extends ResolverState,
  Config extends ResolverConfig
> = Record<string, ComponentTokensNode<State, Config>>
