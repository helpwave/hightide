import type { SetStateAction } from 'react'

export function resolveSetState<T>(action: SetStateAction<T>, prev: T): T {
  return typeof action === 'function' ? (action as (prev: T) => T)(prev) : action
}