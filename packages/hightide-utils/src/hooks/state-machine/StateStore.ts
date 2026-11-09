import type { StateStore } from '../../interfaces/state-store'

export type { StateStore }

export function createStateStore<T>(initial: T): StateStore<T> {
  let current = initial
  const listeners = new Set<() => void>()

  return {
    getSnapshot: () => current,
    set: (value: T) => {
      if (Object.is(current, value)) return
      current = value
      const pending = [...listeners]
      for (const listener of pending) {
        listener()
      }
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
