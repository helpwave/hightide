import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import type { SimpleValueStore } from '@helpwave/hightide-utils/hooks'

const storagePrefix = '@helpwave/hightide/'

export const useNativeKeyValueStore = (): SimpleValueStore => {
  const cacheRef = useRef(new Map<string, string | null>())
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let cancelled = false

    const hydrate = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys()
        const relevantKeys = keys.filter((key) => key.startsWith(storagePrefix))
        if (relevantKeys.length > 0) {
          const entries = await AsyncStorage.multiGet(relevantKeys)
          if (cancelled) return
          for (const [fullKey, value] of entries) {
            cacheRef.current.set(fullKey.slice(storagePrefix.length), value)
          }
        }
      } catch (error) {
        console.error('useNativeKeyValueStore: Failed to hydrate AsyncStorage', error)
      } finally {
        if (!cancelled) {
          setIsInitialized(true)
        }
      }
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => ({
    isInitialized,
    getValue: (key) => {
      if (!cacheRef.current.has(key)) return null
      return cacheRef.current.get(key) ?? null
    },
    setValue: (key, value) => {
      cacheRef.current.set(key, value)
      if (value === null) {
        void AsyncStorage.removeItem(`${storagePrefix}${key}`)
        return
      }
      void AsyncStorage.setItem(`${storagePrefix}${key}`, value)
    },
    deleteValue: (key) => {
      cacheRef.current.delete(key)
      void AsyncStorage.removeItem(`${storagePrefix}${key}`)
    },
  }), [isInitialized])
}
