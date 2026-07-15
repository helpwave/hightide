import { useMemo } from 'react'
import type { SimpleValueStore } from './useSimpleStoreSyncedValue'

export type UseBrowserKeyValueStoreProps = {
  storage?: Storage,
  storageType?: 'local' | 'session',
}

export const useBrowserKeyValueStore = ({
  storage,
  storageType = 'local',
}: UseBrowserKeyValueStoreProps = {}): SimpleValueStore => {
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
      return raw
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
  }), [storageService])
}
