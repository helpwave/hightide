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

  test('uses hightide defaults for starting weekday and calendar type', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext({
      store,
      fallbackLocale: 'en-US',
      supportedLocales,
    }))

    expect(result.current.startingWeekday).toBe('monday')
    expect(result.current.calendarType).toBe('Gregorian')
  })

  test('resolves locale defaults over hightide defaults', () => {
    const store = useMemoryKeyValueStore()
    const localesWithDefaults: SupportedLocalesConfig = {
      'en-US': {
        localName: 'English (US)',
        defaultStartingWeekday: 'sunday',
        defaultCalendarType: 'Gregorian',
        defaultIs24HourFormat: false,
      },
      'de-DE': {
        localName: 'Deutsch',
        defaultStartingWeekday: 'monday',
        defaultIs24HourFormat: true,
      },
    }

    const { result } = renderHook(() => useCreateLocalizationContext({
      store,
      fallbackLocale: 'en-US',
      supportedLocales: localesWithDefaults,
    }))

    expect(result.current.startingWeekday).toBe('sunday')
    expect(result.current.is24HourFormat).toBe(false)
  })

  test('prefers stored starting weekday over locale default', () => {
    const store = useMemoryKeyValueStore()
    const localesWithDefaults: SupportedLocalesConfig = {
      'en-US': {
        localName: 'English (US)',
        defaultStartingWeekday: 'sunday',
      },
    }

    const { result } = renderHook(() => useCreateLocalizationContext({
      store,
      fallbackLocale: 'en-US',
      supportedLocales: localesWithDefaults,
    }))

    act(() => {
      result.current.setStartingWeekday('wednesday')
    })

    expect(result.current.startingWeekday).toBe('wednesday')

    act(() => {
      result.current.setStartingWeekday(null)
    })

    expect(result.current.startingWeekday).toBe('sunday')
  })

  test('setCalendarType null falls back to locale default then hightide default', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateLocalizationContext({
      store,
      fallbackLocale: 'en-US',
      supportedLocales,
    }))

    act(() => {
      result.current.setCalendarType('Gregorian')
    })

    expect(result.current.calendarType).toBe('Gregorian')

    act(() => {
      result.current.setCalendarType(null)
    })

    expect(result.current.calendarType).toBe('Gregorian')
  })
})
