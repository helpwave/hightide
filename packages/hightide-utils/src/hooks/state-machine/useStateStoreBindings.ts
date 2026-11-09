import { useCallback, useEffect, useRef } from 'react'
import type { StateStore } from '../../interfaces/state-store'

export type StateStoreBinding<S, K extends keyof S> = {
  value?: S[K],
  onValueChange?: (value: S[K]) => boolean | undefined | void,
}

export type StateStoreBindings<S extends object> = {
  [K in keyof S]?: StateStoreBinding<S, K>
}

export type UseStateStoreBindingsProps<S extends object> = {
  store: StateStore<S>,
  bindings: StateStoreBindings<S>,
}

type BindingMode = 'controlled' | 'uncontrolled'

function bindingKeys<S extends object>(bindings: StateStoreBindings<S>): (keyof S)[] {
  return Object.keys(bindings) as (keyof S)[]
}

export function useStateStoreBindings<S extends object>({
  store,
  bindings,
}: UseStateStoreBindingsProps<S>): (next: S) => void {
  const bindingsRef = useRef(bindings)
  bindingsRef.current = bindings
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

  return useCallback((next: S) => {
    const current = store.getSnapshot()
    const currentBindings = bindingsRef.current
    let committed = current
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
      const accepted = binding?.onValueChange?.(proposed)
      if (accepted === false) {
        continue
      }
      if (!changed) {
        committed = { ...current }
        changed = true
      }
      committed = { ...committed, [key]: proposed }
    }
    if (changed) {
      store.set(committed)
    }
  }, [store])
}
