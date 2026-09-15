import type { ContextBasedProperty } from '../component-tokens/context-based'
import type { DotPath } from './path'

export type Token = {
  type: string,
  value: unknown,
}

export type TokenRefPath<T extends Token, Path> =
  | DotPath<Path, TokenRefOrValue<T>>
  | DotPath<Path, ContextBasedProperty<TokenRefOrValue<T>>>

export type TokenRef<T extends Token> = {
  type: `ref.${T['type']}`,
  path: string,
  fallback?: TokenRef<T> | T,
}

export type TokenRefOrValue<T extends Token> = T | TokenRef<T>
