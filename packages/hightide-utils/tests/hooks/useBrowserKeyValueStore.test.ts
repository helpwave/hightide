/** @jest-environment jsdom */

import { renderHook } from '@testing-library/react'
import { useBrowserKeyValueStore } from '../../src/hooks/useBrowserKeyValueStore'
import { useSimpleStoreSyncedValue } from '../../src/hooks/useSimpleStoreSyncedValue'

const testLocales = ['en-US', 'de-DE']
type TestLocale = typeof testLocales[number]

const isTestLocale = (value: unknown): value is TestLocale => (
  testLocales.some(item => item === value)
)

describe('useBrowserKeyValueStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('reads and writes values through localStorage', () => {
    const { result: storeResult } = renderHook(() => useBrowserKeyValueStore())

    storeResult.current.setValue('locale', 'de-DE')
    expect(storeResult.current.getValue('locale')).toBe('de-DE')
  })

  test('returns null for empty store values', () => {
    window.localStorage.removeItem('locale')

    const { result: storeResult } = renderHook(() => useBrowserKeyValueStore())

    expect(storeResult.current.getValue('locale')).toBeNull()
  })

  test('works with useSingleValueStore', () => {
    const { result: storeResult } = renderHook(() => useBrowserKeyValueStore())
    const { result: valueResult } = renderHook(() => useSimpleStoreSyncedValue<TestLocale>({
      store: storeResult.current,
      key: 'locale',
      initialValue: 'en-US' as TestLocale,
      decode: (value) => {
        if(isTestLocale(value)) return value
        return null
      },
      encode: (value) => value
    }))

    expect(valueResult.current.value).toBe('en-US')
  })
})
