import { useMemo } from 'react'
import type { KeyValueStore } from './useSimpleStoreSyncedValue'

export type UseBrowserKeyValueStoreProps<T> = {
  storage?: Storage,
  storageType?: 'local' | 'session',
  validate?: (value: unknown) => value is T,
}

export const useBrowserKeyValueStore = <T = unknown>({
  storage,
  storageType = 'local',
  validate,
}: UseBrowserKeyValueStoreProps<T> = {}): KeyValueStore<T> => {
  const storageService = useMemo(() => {
    if (storage !== undefined) {
      return storage
    }
    if (typeof window === 'undefined') {
      return undefined
    }
    return storageType === 'local' ? window.localStorage : window.sessionStorage
  }, [storage, storageType])

  return useMemo(() => ({
    getValue: (key) => {
      if (!storageService) {
        return null
      }
      const raw = storageService.getItem(key)
      if (!raw) {
        return null
      }
      try {
        const parsed: unknown = JSON.parse(raw)
        if (validate && !validate(parsed)) {
          return null
        }
        return parsed as T
      } catch {
        return null
      }
    },
    setValue: (key, value) => {
      if (!storageService) {
        return
      }
      storageService.setItem(key, JSON.stringify(value))
    },
    deleteValue: (key) => {
      storageService?.removeItem(key)
    },
  }), [storageService, validate])
}
