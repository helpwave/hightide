import { useCallback, useEffect } from 'react'
import { useControlledState } from './useControlledState'
import { useEventCallbackStabilizer } from './useEventCallbackStabelizer'

export interface KeyValueStore<TSchema extends Record<string, unknown>> {
  getValue<K extends keyof TSchema>(key: K): TSchema[K],
  setValue<K extends keyof TSchema>(key: K, value: TSchema[K]): void,
  deleteValue<K extends keyof TSchema>(key: K): void,
}

export type SimpleValueStore = KeyValueStore<Record<string, string | null>>

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
  const getStoredValue = useCallback(() => {
    const storeValue = store.getValue(key)
    if(storeValue === null) return null

    try {
      const decodedValue = decode(storeValue)
      return decodedValue
    } catch (e) {
      console.log(e)
      return null
    }
  }, [decode, key, store])

  const [storedValue, setStoredValue] = useControlledState<T | null>({
    value: controlledValue,
    defaultValue: initialValue ?? getStoredValue(),
    onValueChange: onChange,
  })

  const encodeStable = useEventCallbackStabilizer(encode)
  useEffect(() => {
    if(storedValue === null) {
      store.deleteValue(key)
    } else {
      store.setValue(key, encodeStable(storedValue))
    }
  }, [key, storedValue, encodeStable, store])

  const deleteValue = useCallback(() => {
    store.deleteValue(key)
  }, [key, store])

  return {
    value: storedValue,
    setValue: setStoredValue,
    deleteValue,
  }
}