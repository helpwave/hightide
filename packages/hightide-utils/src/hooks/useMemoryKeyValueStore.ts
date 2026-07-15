import type { KeyValueStore } from './useSingleValueStore'

export const useMemoryKeyValueStore = <T = unknown>(): KeyValueStore<T> => {
  const values = new Map<string, T>()

  return {
    getValue: (key) => (values.has(key) ? values.get(key) : null) as T | null,
    setValue: (key, value) => {
      values.set(key, value)
    },
    deleteValue: (key) => {
      values.delete(key)
    },
  }
}
