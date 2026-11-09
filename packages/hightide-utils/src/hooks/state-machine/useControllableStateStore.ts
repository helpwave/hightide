import { useCallback, useEffect, useRef } from 'react'
import type { StateStore } from '../../interfaces/state-store'
import { useStableEvent } from '../useStableEvent'
import { useStateStore } from './useStateStore'

export type UseControllableStateStoreProps<S> = {
  onStateChange?: (state: S) => void,
} & (
    | {
      state: S,
      initialState?: S,
    }
    | {
      state?: undefined,
      initialState: S,
    }
  )

export type UseControllableStateStoreResult<S> = {
  store: StateStore<S>,
  onStateChange: (state: S) => void,
}

export function useControllableStateStore<S>({
  state,
  initialState,
  onStateChange,
}: UseControllableStateStoreProps<S>): UseControllableStateStoreResult<S> {
  const store = useStateStore<S>(() => state !== undefined ? state : initialState as S)
  const hadStateRef = useRef(state !== undefined)
  const onStateChangeStable = useStableEvent(onStateChange)

  useEffect(() => {
    const hasState = state !== undefined
    if (hasState !== hadStateRef.current) {
      console.error('useControllableStateStore: state changed from a defined value to undefined. Either consistently provide a state or only provide an initial state.')
      return
    }
    if (state) {
      if (store.getSnapshot() !== state) {
        store.set(state)
      }
    }
  }, [store, state])

  const handleStateChange = useCallback((next: S) => {
    const last = store.getSnapshot()
    if (!hadStateRef.current) {
      store.set(next)
    }
    if (last !== next)
      onStateChangeStable(next)
  }, [onStateChangeStable, store])

  return {
    store,
    onStateChange: handleStateChange,
  }
}
