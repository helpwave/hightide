'use client'

import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useState } from 'react'
import { LocalStorageService } from '@/src/utils/storage'
import { resolveSetState } from '@/src/utils/resolveSetState'

type SetValue<T> = Dispatch<SetStateAction<T>>

type UseLocalStorageResult<T> = {
  value: T,
  setValue: SetValue<T>,
  deleteValue: () => void,
}

/**
 * @param key Key under which to save the data
 * @param backupValue Used if the storage is unavailable or no value is present
 *
 * The backup value will never be saved to the storage unless you explicitly
 */
export const useLocalStorage = <T>(key: string, backupValue: T): UseLocalStorageResult<T> => {
  const get = useCallback((): T => {
    if (typeof window === 'undefined') {
      return backupValue
    }
    const storageService = new LocalStorageService()
    const value = storageService.get<T>(key)
    return value || backupValue
  }, [backupValue, key])

  const [storedValue, setStoredValue] = useState<T>(get)

  const setValue: SetValue<T> = useCallback(action => {
    const newValue = resolveSetState(action, storedValue)
    const storageService = new LocalStorageService()
    storageService.set(key, newValue)

    setStoredValue(newValue)
  }, [storedValue, setStoredValue, key])

  const deleteValue = () => {
    const storageService = new LocalStorageService()
    storageService.delete(key)
    setStoredValue(backupValue)
  }

  return { value: storedValue, setValue, deleteValue }
}