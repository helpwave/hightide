import { useEffect, useRef } from 'react'
import type { StateStore } from '../../interfaces/state-store'
import { useStableEvent } from '../useStableEvent'
import { useStateStore } from './useStateStore'

export type UseStateStoreBindingProps<S extends object, K extends keyof S> = {
  store: StateStore<S>,
  key: K,
  value?: S[K],
  onValueChange?: (value: S[K]) => void,
}

export function useStateStoreBinding<S extends object, K extends keyof S>({
  store,
  key,
  value,
  onValueChange,
}: UseStateStoreBindingProps<S, K>): StateStore<S[K]> {
  const slice = useStateStore<S[K]>(() => store.getSnapshot()[key])
  const lastValueRef = useRef(slice.getSnapshot())
  const hadValueRef = useRef(value !== undefined)
  const onValueChangeStable = useStableEvent(onValueChange)
  const bindingRef = useRef<StateStore<S[K]> | null>(null)

  if (bindingRef.current === null) {
    bindingRef.current = {
      getSnapshot: () => slice.getSnapshot(),
      subscribe: (listener) => slice.subscribe(listener),
      set: (next) => {
        const parentState = store.getSnapshot()
        if (slice.getSnapshot() !== next) {
          slice.set(next)
        }
        if (parentState[key] !== next) {
          store.set({ ...parentState, [key]: next } as S)
        }
        if (next !== lastValueRef.current) {
          lastValueRef.current = next
          onValueChangeStable(next)
        }
      },
    }
  }

  useEffect(() => {
    return store.subscribe(() => {
      const next = store.getSnapshot()[key]
      if (slice.getSnapshot() !== next) {
        slice.set(next)
      }
      if (next !== lastValueRef.current) {
        lastValueRef.current = next
        onValueChangeStable(next)
      }
    })
  }, [key, onValueChangeStable, slice, store])

  useEffect(() => {
    if (value === undefined) {
      if (hadValueRef.current) {
        console.error('useStateStoreBinding: value changed from a defined value to undefined. Either consistently provide a value or only provide an initial state.')
      }
      return
    }
    hadValueRef.current = true
    lastValueRef.current = value
    const current = store.getSnapshot()
    if (current[key] !== value) {
      store.set({ ...current, [key]: value } as S)
    }
  }, [key, store, value])

  return bindingRef.current
}
