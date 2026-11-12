import { useRef } from 'react'
import type { StateStore } from '../../interfaces/state-store'
import { createStateStore } from './StateStore'

type StoreMode = 'controlled' | 'uncontrolled'

function resolveInitialValue<T>(initial: T | (() => T)): T {
  if (typeof initial === 'function') {
    return (initial as () => T)()
  }
  return initial
}

export function useResolvedStateStore<S>(
  state: StateStore<S> | undefined,
  initialState: S | (() => S)
): StateStore<S> {
  const createdRef = useRef<StateStore<S> | null>(null)
  const externalRef = useRef<StateStore<S> | null>(null)
  const modeRef = useRef<StoreMode | null>(null)

  if (modeRef.current === null) {
    if (state !== undefined) {
      modeRef.current = 'controlled'
      externalRef.current = state
    } else {
      modeRef.current = 'uncontrolled'
      createdRef.current = createStateStore(resolveInitialValue(initialState))
    }
  }

  const isControlled = state !== undefined
  if ((modeRef.current === 'controlled') !== isControlled) {
    console.error(
      'useResolvedStateStore: state changed between a provided store and no store. A state manager stays controlled or uncontrolled.'
    )
  }

  if (state !== undefined) {
    externalRef.current = state
  }

  if (modeRef.current === 'controlled') {
    return (state ?? externalRef.current) as StateStore<S>
  }
  return createdRef.current as StateStore<S>
}
