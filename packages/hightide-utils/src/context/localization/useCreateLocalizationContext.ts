import { useCallback, useEffect, useMemo } from 'react'
import { useEventCallbackStabilizer } from '../../hooks/useEventCallbackStabelizer'
import { useSimpleStoreSyncedValue, type SimpleValueStore } from '../../hooks/useSimpleStoreSyncedValue'
import type { LocalizationContextValue, SupportedLocalesConfig } from './LocalizationContext'
import { StringUnionUtils } from '../../utils/stringUnion'

const localizationHourFormats = ['24h', '12h'] as const
type LocalizationHourFormat = typeof localizationHourFormats[number]

export type UseCreateLocalizationContextProps = {
  store: SimpleValueStore,
  fallbackLocale: string,
  supportedLocales: SupportedLocalesConfig,
  fallbackTimeZone?: string,
  fallbackIs24HourFormat?: boolean,
  locale?: string,
  systemLocale?: string,
  timeZone?: string,
  is24HourFormat?: boolean,
  onChangedLocale?: (locale: string) => void,
  onChangedTimeZone?: (timeZone: string | undefined) => void,
  onChangedIs24HourFormat?: (is24HourFormat: boolean) => void,
}

export const useCreateLocalizationContext = ({
  store,
  fallbackLocale,
  supportedLocales,
  fallbackTimeZone,
  fallbackIs24HourFormat,
  locale,
  systemLocale,
  timeZone,
  is24HourFormat,
  onChangedLocale,
  onChangedTimeZone,
  onChangedIs24HourFormat,
}: UseCreateLocalizationContextProps): LocalizationContextValue => {
  const supportedLocaleKeys = useMemo(
    () => Object.keys(supportedLocales),
    [supportedLocales]
  )

  const {
    value: storedLocale,
    setValue: setStoredLocale,
    deleteValue: deleteStoredLocale,
  } = useSimpleStoreSyncedValue<string>({
    store,
    key: 'locale',
    decode: useCallback((value: string) => {
      if (StringUnionUtils.isUnionValue(value, supportedLocaleKeys)) return value
      return null
    }, [supportedLocaleKeys]),
    encode: useCallback((value) => value, []),
  })
  const {
    value: storedTimeZone,
    setValue: setStoredTimeZone,
    deleteValue: deleteStoredTimeZone,
  } = useSimpleStoreSyncedValue<string>({
    store,
    key: 'timeZone',
    decode: useCallback((value: string) => value, []),
    encode: useCallback((value) => value, []),
  })
  const {
    value: hourFormat,
    setValue: setStoredHourFormat,
    deleteValue: deleteStoredHourFormat,
  } = useSimpleStoreSyncedValue<LocalizationHourFormat>({
    store,
    key: 'hourFormat',
    decode: useCallback((value: string) => {
      if (StringUnionUtils.isUnionValue(value, localizationHourFormats)) return value
      return null
    }, []),
    encode: useCallback((value) => value, []),
  })

  const resolvedLocale = useMemo(() => {
    if (locale && locale !== 'system') {
      return locale
    }
    if (storedLocale) {
      return storedLocale
    }
    if (systemLocale && StringUnionUtils.isUnionValue(systemLocale, supportedLocaleKeys)) {
      return systemLocale
    }
    return fallbackLocale
  }, [fallbackLocale, locale, storedLocale, supportedLocaleKeys, systemLocale])

  useEffect(() => {
    if (!locale) return
    if (locale === 'system') {
      deleteStoredLocale()
    } else if (StringUnionUtils.isUnionValue(locale, supportedLocaleKeys)) {
      setStoredLocale(locale)
    }
  }, [locale, deleteStoredLocale, setStoredLocale, supportedLocaleKeys])

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

  const setLocale = useCallback((newLocale: string) => {
    if (locale !== undefined) {
      console.warn(
        'useCreateLocalizationContext: Attempting to change the locale while setting a fixed locale won\'t have any effect. '
          + 'Change the locale provided to the LocalizationProvider instead.'
      )
      return
    }
    if (newLocale === 'system') {
      deleteStoredLocale()
      return
    }
    if (!StringUnionUtils.isUnionValue(newLocale, supportedLocaleKeys)) return
    setStoredLocale(newLocale)
  }, [deleteStoredLocale, locale, setStoredLocale, supportedLocaleKeys])

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
    supportedLocales,
    timeZone: resolvedTimeZone,
    setTimeZone,
    is24HourFormat: resolvedIs24HourFormat,
    setIs24HourFormat,
    isInitialized: store.isInitialized,
  }
}
