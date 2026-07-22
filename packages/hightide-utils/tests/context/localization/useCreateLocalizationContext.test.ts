/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { useMemoryKeyValueStore } from '../../../src/hooks/useMemoryKeyValueStore'
import { useCreateLocalizationContext } from '../../../src/context/localization/useCreateLocalizationContext'
import type { SupportedLocalesConfig } from '../../../src/context/localization/LocalizationContext'

describe('useCreateLocalizationContext', () => {
  const supportedLocales: SupportedLocalesConfig = {
    'en-US': { localName: 'English (US)' },
    'de-DE': { localName: 'Deutsch' },
  }

  test('resolves locale from controlled prop', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext({
      store,
      fallbackLocale: 'en-US',
      supportedLocales,
      locale: 'de-DE',
    }))

    expect(result.current.locale).toBe('de-DE')
  })

  test('falls back to fallback locale', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext({
      store,
      fallbackLocale: 'en-US',
      supportedLocales,
    }))

    expect(result.current.locale).toBe('en-US')
  })

  test('prefers system locale over fallback locale', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext({
      store,
      fallbackLocale: 'en-US',
      supportedLocales,
      systemLocale: 'de-DE',
    }))

    expect(result.current.locale).toBe('de-DE')
  })

  test('updates stored locale via setLocale', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext({
      store,
      fallbackLocale: 'en-US',
      supportedLocales,
    }))

    act(() => {
      result.current.setLocale('de-DE')
    })

    expect(result.current.locale).toBe('de-DE')
  })

  test('ignores unsupported locales via setLocale', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext({
      store,
      fallbackLocale: 'en-US',
      supportedLocales,
    }))

    act(() => {
      result.current.setLocale('fr-FR')
    })

    expect(result.current.locale).toBe('en-US')
  })

  test('exposes supported locale information', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext({
      store,
      fallbackLocale: 'en-US',
      supportedLocales,
    }))

    expect(result.current.supportedLocales).toEqual(supportedLocales)
  })
})
