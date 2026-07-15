import type { SimpleValueStore } from './useSimpleStoreSyncedValue'

export const useMemoryKeyValueStore = (): SimpleValueStore => {
  const values = new Map<string, string>()

  return {
    getValue: (key) => values.has(key) ? values.get(key) ?? null : null,
    setValue: (key, value) => {
      if(value === null) {
        values.delete(key)
        return
      }
      values.set(key, value)
    },
    deleteValue: (key) => {
      values.delete(key)
    },
  }
}
