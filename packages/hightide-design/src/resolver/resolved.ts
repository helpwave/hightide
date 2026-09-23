import type { ContainerStyle } from './container-style'
import type { IconStyle } from './icon-style'
import type { TextStyle } from './text-style'

export type Resolved<T> =
  T extends { type: 'container' } ? ContainerStyle
    : T extends { type: 'icon' } ? IconStyle
      : T extends { type: 'textStyle' } ? TextStyle
        : T extends ReadonlySet<infer _U> ? T
          : T extends object
            ? { [K in keyof T]: Resolved<T[K]> }
            : T
