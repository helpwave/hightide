/** @jest-environment jsdom */

import { renderHook } from '@testing-library/react'
import { useBrowserKeyValueStore } from '../../src/hooks/useBrowserKeyValueStore'
import { useSingleValueStore } from '../../src/hooks/useSingleValueStore'

type TestLocale = 'en-US' | 'de-DE'

const isTestLocale = (value: unknown): value is TestLocale => (
  value === 'en-US' || value === 'de-DE'
)

describe('useBrowserKeyValueStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('reads and writes values through localStorage', () => {
    const { result: storeResult } = renderHook(() => useBrowserKeyValueStore<TestLocale>({
      validate: isTestLocale,
    }))

    storeResult.current.setValue('locale', 'de-DE')
    expect(storeResult.current.getValue('locale')).toBe('de-DE')
  })

  test('returns null for invalid stored values', () => {
    window.localStorage.setItem('locale', JSON.stringify('fr-FR'))

    const { result: storeResult } = renderHook(() => useBrowserKeyValueStore<TestLocale>({
      validate: isTestLocale,
    }))

    expect(storeResult.current.getValue('locale')).toBeNull()
  })

  test('works with useSingleValueStore', () => {
    const { result: storeResult } = renderHook(() => useBrowserKeyValueStore<TestLocale>({
      validate: isTestLocale,
    }))
    const { result: valueResult } = renderHook(() => useSingleValueStore({
      store: storeResult.current,
      key: 'locale',
      defaultValue: 'en-US' as TestLocale,
    }))

    expect(valueResult.current.value).toBe('en-US')
  })
})
