import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { LocalStorageService } from '../util/storage'
import { resolveSetState } from '../util/resolveSetState'

type SetValue<T> = Dispatch<SetStateAction<T>>
export const useLocalStorage = <T>(key: string, initValue: T): [T, SetValue<T>] => {
  const get = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initValue
    }
    const storageService = new LocalStorageService()
    const value = storageService.get<T>(key)
    return value || initValue
  }, [initValue, key])

  const [storedValue, setStoredValue] = useState<T>(get)

  const setValue: SetValue<T> = useCallback(action => {
    const newValue = resolveSetState(action, storedValue)
    const storageService = new LocalStorageService()
    storageService.set(key, newValue)

    setStoredValue(newValue)
  }, [storedValue, setStoredValue, key])

  useEffect(() => {
    setStoredValue(get())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return [storedValue, setValue]
}