/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { useMemoryKeyValueStore } from '../../src/hooks/useMemoryKeyValueStore'
import { useSimpleStoreSyncedValue } from '../../src/hooks/useSimpleStoreSyncedValue'

describe('useSingleValueStore', () => {
  test('reads the default value when the store is empty', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useSimpleStoreSyncedValue({
      store,
      key: 'locale',
      initialValue: 'en-US',
      encode: (value) => value,
      decode: (value) => value
    }))

    expect(result.current.value).toBe('en-US')
  })

  test('persists values through the store', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useSimpleStoreSyncedValue({
      store,
      key: 'locale',
      initialValue: 'en-US',
      encode: (value) => value,
      decode: (value) => value
    }))

    act(() => {
      result.current.setValue('de-DE')
    })

    expect(result.current.value).toBe('de-DE')
    expect(store.getValue('locale')).toBe('de-DE')
  })

  test('resets to the default value on delete', () => {
    const store = useMemoryKeyValueStore()
    store.setValue('locale', 'de-DE')

    const { result } = renderHook(() => useSimpleStoreSyncedValue({
      store,
      key: 'locale',
      initialValue: 'en-US',
      encode: (value) => value,
      decode: (value) => value
    }))

    act(() => {
      result.current.deleteValue()
    })

    expect(result.current.value).toBe(null)
    expect(store.getValue('locale')).toBeNull()
  })
})
