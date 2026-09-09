import type { ContextBasedProperty } from './context-based'
import type { Resolvable } from './resolvable'
import type { TokenContext } from './token-context'

export type ComponentTokenConfigValue<
  T,
  Context = TokenContext<unknown>,
  S extends string = string,
  C extends Record<string, string> = Record<string, string>
> =
  | Resolvable<T, Context>
  | (
    T extends object
      ? { readonly [K in keyof T]?: ComponentTokenConfigField<NonNullable<T[K]>, Context, S, C> }
      : never
  )

export type ComponentTokenConfigField<
  T,
  Context = TokenContext<unknown>,
  S extends string = string,
  C extends Record<string, string> = Record<string, string>
> =
  | ContextBasedProperty<S, C, ComponentTokenConfigValue<T, Context, S, C> | undefined>
  | ComponentTokenConfigValue<T, Context, S, C>

export type ComponentTokenConfig<
  T,
  Context = TokenContext<unknown>,
  S extends string = string,
  C extends Record<string, string> = Record<string, string>
> = {
  readonly [K in keyof T]?: ComponentTokenConfigField<
    NonNullable<T[K]>,
    Context,
    S,
    C
  >
}
