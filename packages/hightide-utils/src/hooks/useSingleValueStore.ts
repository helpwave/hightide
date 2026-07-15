import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useState } from 'react'
import { SetStateUtils } from '../utils/setStateUtils'

export type KeyValueStore<T> = {
  getValue: (key: string) => T | null,
  setValue: (key: string, value: T) => void,
  deleteValue: (key: string) => void,
}

export type UseSingleValueStoreProps<T> = {
  store: KeyValueStore<T>,
  key: string,
  defaultValue: T,
}

export type UseSingleValueStoreResult<T> = {
  value: T,
  setValue: Dispatch<SetStateAction<T>>,
  deleteValue: () => void,
}

export const useSingleValueStore = <T>({
  store,
  key,
  defaultValue,
}: UseSingleValueStoreProps<T>): UseSingleValueStoreResult<T> => {
  const [value, setValueState] = useState<T>(() => store.getValue(key) ?? defaultValue)

  const setValue = useCallback((action: SetStateAction<T>) => {
    setValueState((previousValue) => {
      const nextValue = SetStateUtils.resolve(action, previousValue)
      store.setValue(key, nextValue)
      return nextValue
    })
  }, [store, key])

  const deleteValue = useCallback(() => {
    store.deleteValue(key)
    setValueState(defaultValue)
  }, [store, key, defaultValue])

  return { value, setValue, deleteValue }
}
