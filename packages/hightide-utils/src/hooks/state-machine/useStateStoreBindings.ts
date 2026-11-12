import { useCallback, useEffect, useRef } from 'react'
import type { StateStore } from '../../interfaces/state-store'
import { useStableEvent } from '../useStableEvent'

export type StateStoreChange<T> =
  | { action: 'acceptChange' }
  | { action: 'rejectChange' }
  | { action: 'overwrite', value: T }

export type StateStoreBindingChange<T> = StateStoreChange<T>

export type StateTransitionInformation<S, E> = {
  event: E,
  previousState: S,
}

export type BindingTransitionInformation<S, K extends keyof S, E> = {
  event: E,
  previousValue: S[K],
  previousState: S,
}

function isStateStoreChange<T>(
  change: StateStoreChange<T> | void
): change is StateStoreChange<T> {
  return typeof change === 'object' && change !== null
}

export type StateStoreBinding<S, K extends keyof S, E = unknown> = {
  value?: S[K],
  onValueChange?: (
    value: S[K],
    transition: BindingTransitionInformation<S, K, E>,
  ) => StateStoreChange<S[K]> | void,
}

export type StateStoreBindings<S extends object, E = unknown> = {
  [K in keyof S]?: StateStoreBinding<S, K, E>
}

export type UseStateStoreBindingsProps<S extends object, E = unknown> = {
  store: StateStore<S>,
  bindings: StateStoreBindings<S, E>,
  onStateChange?: (
    state: S,
    transition: StateTransitionInformation<S, E>,
  ) => StateStoreChange<S> | void,
}

type BindingMode = 'controlled' | 'uncontrolled'

function bindingKeys<S extends object, E>(bindings: StateStoreBindings<S, E>): (keyof S)[] {
  return Object.keys(bindings) as (keyof S)[]
}

export function useStateStoreBindings<S extends object, E = unknown>({
  store,
  bindings,
  onStateChange,
}: UseStateStoreBindingsProps<S, E>): (next: S, transition?: StateTransitionInformation<S, E>) => void {
  const bindingsRef = useRef(bindings)
  useEffect(() => {
    bindingsRef.current = bindings
  }, [bindings])
  const onStateChangeStable = useStableEvent(onStateChange)
  const modesRef = useRef<Partial<Record<keyof S, BindingMode>> | null>(null)
  const seenControlledRef = useRef<Partial<Record<keyof S, boolean>>>({})

  if (modesRef.current === null) {
    const modes: Partial<Record<keyof S, BindingMode>> = {}
    for (const key of bindingKeys(bindings)) {
      const isControlled = bindings[key]?.value !== undefined
      modes[key] = isControlled ? 'controlled' : 'uncontrolled'
      seenControlledRef.current[key] = isControlled
    }
    modesRef.current = modes
  }

  for (const key of bindingKeys(bindings)) {
    const isControlled = bindings[key]?.value !== undefined
    const seen = seenControlledRef.current[key]
    if (seen === undefined || seen === isControlled) {
      seenControlledRef.current[key] = isControlled
      continue
    }
    seenControlledRef.current[key] = isControlled
    const keyName = String(key)
    if (seen && !isControlled) {
      console.error(
        `useStateStoreBindings: value for "${keyName}" changed from a defined value to undefined. A binding stays controlled or uncontrolled.`
      )
    } else {
      console.error(
        `useStateStoreBindings: value for "${keyName}" changed from undefined to a defined value. A binding stays controlled or uncontrolled.`
      )
    }
  }

  useEffect(() => {
    const modes = modesRef.current
    if (!modes) {
      return
    }
    const current = store.getSnapshot()
    let committed = current
    let changed = false
    for (const key of bindingKeys(bindings)) {
      if (modes[key] !== 'controlled') {
        continue
      }
      const value = bindings[key]?.value
      if (value === undefined || Object.is(current[key], value)) {
        continue
      }
      if (!changed) {
        committed = { ...current }
        changed = true
      }
      committed = { ...committed, [key]: value }
    }
    if (changed) {
      store.set(committed)
    }
  })

  return useCallback((next: S, transition?: StateTransitionInformation<S, E>) => {
    const current = store.getSnapshot()
    const previousState = transition?.previousState ?? current
    const event = transition?.event as E
    const currentBindings = bindingsRef.current
    let adjusted = current
    let changed = false
    const keys = new Set<keyof S>([
      ...bindingKeys(currentBindings),
      ...(Object.keys(next) as (keyof S)[]),
    ])
    for (const key of keys) {
      const binding = currentBindings[key]
      const proposed = next[key]
      if (Object.is(proposed, current[key])) {
        continue
      }
      const change = binding?.onValueChange?.(proposed, {
        event,
        previousValue: current[key],
        previousState,
      })
      if (isStateStoreChange(change) && change.action === 'rejectChange') {
        continue
      }
      const value = isStateStoreChange(change) && change.action === 'overwrite' ? change.value : proposed
      if (Object.is(value, current[key])) {
        continue
      }
      if (!changed) {
        adjusted = { ...current }
        changed = true
      }
      adjusted = { ...adjusted, [key]: value }
    }
    const stateChange = onStateChangeStable(adjusted, { event, previousState })
    if (isStateStoreChange(stateChange) && stateChange.action === 'rejectChange') {
      return
    }
    const committed = isStateStoreChange(stateChange) && stateChange.action === 'overwrite'
      ? stateChange.value
      : adjusted
    if (!Object.is(committed, current)) {
      store.set(committed)
    }
  }, [store, onStateChangeStable])
}
