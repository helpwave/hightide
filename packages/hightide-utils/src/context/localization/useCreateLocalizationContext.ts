import { useCallback, useEffect, useMemo } from 'react'
import { useEventCallbackStabilizer } from '../../hooks/useEventCallbackStabelizer'
import type { KeyValueStore } from '../../hooks/useSingleValueStore'
import { useSingleValueStore } from '../../hooks/useSingleValueStore'
import type {
  LocaleWithSystem,
  LocalizationContextValue,
  UseCreateLocalizationContextProps
} from './types'

type HourFormat = '24h' | '12h'

export const useCreateLocalizationContext = <TLocale extends string>({
  store,
  fallbackLocale,
  fallbackTimeZone,
  fallbackIs24HourFormat,
  locale,
  systemLocale,
  timeZone,
  is24HourFormat,
  onChangedLocale,
  onChangedTimeZone,
  onChangedIs24HourFormat,
}: UseCreateLocalizationContextProps<TLocale>): LocalizationContextValue<TLocale> => {
  const {
    value: storedLocale,
    setValue: setStoredLocale,
    deleteValue: deleteStoredLocale,
  } = useSingleValueStore<TLocale | null>({
    store: store as KeyValueStore<unknown> as KeyValueStore<TLocale | null>,
    key: 'locale',
    defaultValue: null,
  })
  const {
    value: storedTimeZone,
    setValue: setStoredTimeZone,
    deleteValue: deleteStoredTimeZone,
  } = useSingleValueStore<string | null>({
    store: store as KeyValueStore<unknown> as KeyValueStore<string | null>,
    key: 'timeZone',
    defaultValue: null,
  })
  const {
    value: hourFormat,
    setValue: setStoredHourFormat,
    deleteValue: deleteStoredHourFormat,
  } = useSingleValueStore<HourFormat | null>({
    store: store as KeyValueStore<unknown> as KeyValueStore<HourFormat | null>,
    key: 'hourFormat',
    defaultValue: null,
  })

  const resolvedLocale = useMemo(() => {
    if (locale && locale !== 'system') {
      return locale
    }
    if (storedLocale) {
      return storedLocale
    }
    if (systemLocale) {
      return systemLocale
    }
    return fallbackLocale
  }, [fallbackLocale, locale, storedLocale, systemLocale])

  useEffect(() => {
    if (!locale) return
    if (locale === 'system') {
      deleteStoredLocale()
    } else {
      setStoredLocale(locale)
    }
  }, [locale, deleteStoredLocale, setStoredLocale])

  const resolvedTimeZone = useMemo(() => {
    return timeZone ?? storedTimeZone ?? fallbackTimeZone
  }, [timeZone, storedTimeZone, fallbackTimeZone])

  useEffect(() => {
    if (timeZone === undefined) return
    setStoredTimeZone(timeZone)
  }, [timeZone, setStoredTimeZone])

  const resolvedIs24HourFormat: boolean = useMemo(() => {
    const storedIs24HourFormat = hourFormat === null ? null : hourFormat === '24h'
    return is24HourFormat ?? storedIs24HourFormat ?? fallbackIs24HourFormat ?? true
  }, [is24HourFormat, hourFormat, fallbackIs24HourFormat])

  useEffect(() => {
    if (is24HourFormat === undefined) return
    setStoredHourFormat(is24HourFormat ? '24h' : '12h')
  }, [is24HourFormat, setStoredHourFormat])

  const onChangeRef = useEventCallbackStabilizer(onChangedLocale)

  useEffect(() => {
    onChangeRef?.(resolvedLocale)
  }, [resolvedLocale, onChangeRef])

  const onChangeTimeZoneRef = useEventCallbackStabilizer(onChangedTimeZone)

  useEffect(() => {
    onChangeTimeZoneRef?.(resolvedTimeZone)
  }, [resolvedTimeZone, onChangeTimeZoneRef])

  const onChangeIs24HourFormatRef = useEventCallbackStabilizer(onChangedIs24HourFormat)

  useEffect(() => {
    onChangeIs24HourFormatRef?.(resolvedIs24HourFormat)
  }, [resolvedIs24HourFormat, onChangeIs24HourFormatRef])

  const setLocale = useCallback((newLocale: LocaleWithSystem<TLocale>) => {
    if (locale !== undefined) {
      console.warn(
        'useCreateLocalizationContext: Attempting to change the locale while setting a fixed locale won\'t have any effect. '
          + 'Change the locale provided to the LocalizationProvider instead.'
      )
      return
    }
    if (newLocale === 'system') {
      deleteStoredLocale()
    } else {
      setStoredLocale(newLocale)
    }
  }, [deleteStoredLocale, locale, setStoredLocale])

  const setTimeZone = useCallback((newTimeZone: string | null) => {
    if (timeZone !== undefined) {
      console.warn(
        'useCreateLocalizationContext: Attempting to change the time zone while setting a fixed time zone won\'t have any effect. '
          + 'Change the timeZone provided to the LocalizationProvider instead.'
      )
      return
    }
    if (newTimeZone === null) {
      deleteStoredTimeZone()
    } else {
      setStoredTimeZone(newTimeZone)
    }
  }, [deleteStoredTimeZone, setStoredTimeZone, timeZone])

  const setIs24HourFormat = useCallback((newIs24HourFormat: boolean | null) => {
    if (is24HourFormat !== undefined) {
      console.warn(
        'useCreateLocalizationContext: Attempting to change the hour format while setting a fixed hour format won\'t have any effect. '
          + 'Change the is24HourFormat provided to the LocalizationProvider instead.'
      )
      return
    }
    if (newIs24HourFormat === null) {
      deleteStoredHourFormat()
    } else {
      setStoredHourFormat(newIs24HourFormat ? '24h' : '12h')
    }
  }, [deleteStoredHourFormat, is24HourFormat, setStoredHourFormat])

  return {
    locale: resolvedLocale,
    setLocale,
    timeZone: resolvedTimeZone,
    setTimeZone,
    is24HourFormat: resolvedIs24HourFormat,
    setIs24HourFormat,
  }
}
