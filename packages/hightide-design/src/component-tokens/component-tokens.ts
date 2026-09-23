import type { ResolverConfig, ResolverState } from '../primitive-tokens'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import type { TextTokens } from './text-tokens'

export type ComponentTokensNode<
  State extends ResolverState = ResolverState,
  Config extends ResolverConfig = ResolverConfig
> =
  | { readonly [key: string]: ComponentTokensNode<State, Config> }
  | IconTokens
  | ContainerTokens
  | TextTokens

export type ComponentTokens<
  State extends ResolverState = ResolverState,
  Config extends ResolverConfig = ResolverConfig
> = Record<string, ComponentTokensNode<State, Config>>
