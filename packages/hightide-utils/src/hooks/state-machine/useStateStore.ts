import { useRef } from 'react'
import { createStateStore, type StateStore } from './StateStore'

function resolveInitialValue<T>(initial: T | (() => T)): T {
  if (typeof initial === 'function') {
    return (initial as () => T)()
  }
  return initial
}

export function useStateStore<T>(initial: T | (() => T)): StateStore<T> {
  const storeRef = useRef<StateStore<T> | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createStateStore(resolveInitialValue(initial))
  }
  return storeRef.current
}
