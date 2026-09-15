import type { Token, TokenRefOrValue } from '../utils/token-type'

export type ResolvableLeaves<T> =
  T extends Token
    ? TokenRefOrValue<T>
    : T extends object
      ? { [K in keyof T]: ResolvableLeaves<T[K]> }
      : T
