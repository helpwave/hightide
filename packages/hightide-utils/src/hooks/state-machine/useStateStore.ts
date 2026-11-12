import { useCallback, useRef, useSyncExternalStore } from 'react'
import { useStableEvent } from '../useStableEvent'
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

export function useStateStoreSelector<T, R>(store: StateStore<T>, selector: (state: T) => R): R {
  const select = useStableEvent(selector)
  const cache = useRef<{ snapshot: T, selected: R } | null>(null)
  const getSnapshot = useCallback(() => {
    const snapshot = store.getSnapshot()
    const cached = cache.current
    if (cached && cached.snapshot === snapshot) {
      return cached.selected
    }
    const selected = select(snapshot)
    if (cached && Object.is(cached.selected, selected)) {
      cache.current = { snapshot, selected: cached.selected }
      return cached.selected
    }
    cache.current = { snapshot, selected }
    return selected
  }, [select, store])
  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}
