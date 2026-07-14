import type { SetStateAction } from 'react'

const resolveSetState = <T>(action: SetStateAction<T>, prev: T): T => {
  return typeof action === 'function' ? (action as (prev: T) => T)(prev) : action
}

export const ResolveSetStateUtils = {
  resolveSetState,
}

/** @deprecated Use ResolveSetStateUtils.resolveSetState instead. */
export { resolveSetState }
