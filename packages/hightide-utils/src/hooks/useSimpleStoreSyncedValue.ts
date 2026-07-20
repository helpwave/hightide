import { useCallback, useEffect, useState } from 'react'
import { useControlledState } from './useControlledState'
import { useEventCallbackStabilizer } from './useEventCallbackStabelizer'

export interface KeyValueStore<TSchema extends Record<string, unknown>> {
  getValue<K extends keyof TSchema>(key: K): TSchema[K],
  setValue<K extends keyof TSchema>(key: K, value: TSchema[K]): void,
  deleteValue<K extends keyof TSchema>(key: K): void,
}

export type SimpleValueStore = KeyValueStore<Record<string, string | null>> & {
  isInitialized: boolean,
}

export type UseSimpleStoreSyncedValueProps<T> = {
  store: SimpleValueStore,
  key: string,
  value?: T,
  /** The value that will be set initially and overwrites any previous value */
  initialValue?: T,
  onChange?: (value: T | null) => void,
  decode: (value: string) => T | null,
  encode: (value: T) => string,
}

export type UseSimpleStoreSyncedValueResult<T> = {
  value: T | null,
  setValue: (value: T) => void,
  deleteValue: () => void,
}

const defaultEncoder = JSON.stringify
const defaultDecoder = JSON.parse

export function useSimpleStoreSyncedValue<T>({
  store,
  key,
  value: controlledValue,
  initialValue,
  onChange,
  decode = defaultDecoder as (value: string) => T | null,
  encode = defaultEncoder,
}: UseSimpleStoreSyncedValueProps<T>): UseSimpleStoreSyncedValueResult<T> {
  const [hasRead, setHasRead] = useState(false)

  const getStoredValue = useCallback(() => {
    const storeValue = store.getValue(key)
    if (storeValue === null) return null

    try {
      return decode(storeValue)
    } catch (e) {
      console.log(e)
      return null
    }
  }, [decode, key, store])

  const [storedValue, setStoredValue] = useControlledState<T | null>({
    value: controlledValue,
    defaultValue: initialValue ?? null,
    onValueChange: onChange,
  })

  useEffect(() => {
    if (!store.isInitialized || hasRead) return

    if (initialValue === undefined && controlledValue === undefined) {
      const fromStore = getStoredValue()
      if (fromStore !== null) {
        setStoredValue(fromStore)
      }
    }

    setHasRead(true)
  }, [
    controlledValue,
    getStoredValue,
    hasRead,
    initialValue,
    setStoredValue,
    store.isInitialized,
  ])

  const encodeStable = useEventCallbackStabilizer(encode)
  useEffect(() => {
    if (!store.isInitialized || !hasRead) return

    if (storedValue === null) {
      store.deleteValue(key)
    } else {
      store.setValue(key, encodeStable(storedValue))
    }
  }, [encodeStable, hasRead, key, store, storedValue])

  const deleteValue = useCallback(() => {
    setStoredValue(null)
  }, [setStoredValue])

  return {
    value: storedValue,
    setValue: setStoredValue,
    deleteValue,
  }
}
