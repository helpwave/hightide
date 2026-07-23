'use client'

import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StorageListener } from '../utils/StorageListener'

interface UseStorageProps<T> {
  key: string,
  defaultValue: T,
  storageType?: 'local' | 'session',
  serialize?: (value: T) => string,
  deserialize?: (value: string) => T,
  /** Whether to listen for storage events and update the value automatically. Defaults to true. */
  listen?: boolean,
}

interface UseStorageResult<T> {
  value: T,
  setValue: Dispatch<SetStateAction<T>>,
  deleteValue: () => void,
}

export const useStorage = <T>({
  key,
  defaultValue,
  storageType = 'local',
  serialize = JSON.stringify,
  deserialize = JSON.parse,
  listen = true
}: UseStorageProps<T>): UseStorageResult<T> => {
  const lastSerializedRef = useRef<string | null>(null)

  const storageService: Storage | undefined = useMemo(() => {
    if(typeof window === 'undefined') return undefined
    if (storageType === 'local') {
      return window.localStorage
    }
    return window.sessionStorage
  }, [storageType])

  const get = useCallback((): T => {
    if (!storageService) {
      return defaultValue
    }
    try {
      const value = storageService.getItem(key)
      if(!value) {
        return defaultValue
      }
      return deserialize(value)
    } catch (error) {
      console.warn('useStorage: Error while reading or deserializing the stored value. Make sure your deserialize function is correct.', error)
      return defaultValue
    }
  }, [storageService, key, deserialize, defaultValue])

  const [value, setValue] = useState<T>(get)

  useEffect(() => {
    if(!storageService) return
    let serializedValue: string
    try {
      serializedValue = serialize(value)
    } catch (error) {
      console.warn('useStorage: Error while serializing the value. Make sure your serialize function is correct.', error)
      return
    }

    if(serializedValue === lastSerializedRef.current) return

    lastSerializedRef.current = serializedValue
    try {
      storageService?.setItem(key, serialize(value))
    } catch (error) {
      console.warn('useStorage: Error while writing the value. Make sure your serialize function is correct.', error)
    }
  }, [value, serialize, storageService, key])

  const deleteValue = useCallback(() => {
    try {
      storageService?.removeItem(key)
    } catch {
      console.warn('useStorage: Error while deleting the value.')
    }
    setValue(defaultValue)
  }, [storageService, key, setValue, defaultValue])

  useEffect(() => {
    if (!listen) return
    if (!storageService) return

    const listener = StorageListener.getInstance()

    return listener.subscribe(storageService, key, (raw) => {
      if (raw === null) {
        lastSerializedRef.current = null
        setValue(defaultValue)
        return
      }

      try {
        lastSerializedRef.current = raw
        setValue(deserialize(raw))
      } catch (error) {
        console.warn('useStorage: deserialization failed', error)
      }
    })
  }, [storageService, key, deserialize, defaultValue, listen])

  return { value, setValue, deleteValue }
}