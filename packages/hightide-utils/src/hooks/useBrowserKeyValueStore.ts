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
    isInitialized: true,
    getValue: (key) => {
      if (!storageService) {
        return null
      }
      return storageService.getItem(key)
    },
    setValue: (key, value) => {
      if (!storageService) {
        return
      }
      if (value === null) {
        storageService.removeItem(key)
        return
      }
      storageService.setItem(key, value)
    },
    deleteValue: (key) => {
      storageService?.removeItem(key)
    },
  }), [storageService])
}
