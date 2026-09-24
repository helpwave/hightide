import type { ResolverConfig } from '../primitive-tokens'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import type { TextTokens } from './text-tokens'

export type ComponentTokensNode<
  Config extends ResolverConfig = ResolverConfig
> =
  | { readonly [key: string]: ComponentTokensNode<Config> }
  | IconTokens
  | ContainerTokens
  | TextTokens

export type ComponentTokens<
  Config extends ResolverConfig = ResolverConfig
> = Record<string, ComponentTokensNode<Config>>
