/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { useMemoryKeyValueStore } from '../../../src/hooks/useMemoryKeyValueStore'
import { useCreateLocalizationContext } from '../../../src/context/localization/useCreateLocalizationContext'

describe('useCreateLocalizationContext', () => {
  type TestLocale = 'en-US' | 'de-DE'

  test('resolves locale from controlled prop', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext<TestLocale>({
      store,
      fallbackLocale: 'en-US',
      locale: 'de-DE',
    }))

    expect(result.current.locale).toBe('de-DE')
  })

  test('falls back to fallback locale', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext<TestLocale>({
      store,
      fallbackLocale: 'en-US',
    }))

    expect(result.current.locale).toBe('en-US')
  })

  test('prefers system locale over fallback locale', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext<TestLocale>({
      store,
      fallbackLocale: 'en-US',
      systemLocale: 'de-DE',
    }))

    expect(result.current.locale).toBe('de-DE')
  })

  test('updates stored locale via setLocale', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext<TestLocale>({
      store,
      fallbackLocale: 'en-US',
    }))

    act(() => {
      result.current.setLocale('de-DE')
    })

    expect(result.current.locale).toBe('de-DE')
  })
})
