import type { SetStateAction } from 'react'

const resolve = <T>(action: SetStateAction<T>, prev: T): T => {
  return typeof action === 'function' ? (action as (prev: T) => T)(prev) : action
}

export const SetStateUtils = {
  resolve,
}

/** @deprecated Use ResolveSetStateUtils.resolveSetState instead. */
export { resolve as resolveSetState }
