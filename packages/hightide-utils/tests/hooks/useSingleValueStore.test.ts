/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { useMemoryKeyValueStore } from '../../src/hooks/useMemoryKeyValueStore'
import { useSingleValueStore } from '../../src/hooks/useSingleValueStore'

describe('useSingleValueStore', () => {
  test('reads the default value when the store is empty', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useSingleValueStore({
      store,
      key: 'locale',
      defaultValue: 'en-US',
    }))

    expect(result.current.value).toBe('en-US')
  })

  test('persists values through the store', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useSingleValueStore({
      store,
      key: 'locale',
      defaultValue: 'en-US',
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

    const { result } = renderHook(() => useSingleValueStore({
      store,
      key: 'locale',
      defaultValue: 'en-US',
    }))

    act(() => {
      result.current.deleteValue()
    })

    expect(result.current.value).toBe('en-US')
    expect(store.getValue('locale')).toBeNull()
  })
})
