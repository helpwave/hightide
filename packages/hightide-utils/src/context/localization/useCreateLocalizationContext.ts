import { useCallback, useEffect, useMemo } from 'react'
import { useEventCallbackStabilizer } from '../../hooks/useEventCallbackStabelizer'
import { useSimpleStoreSyncedValue, type SimpleValueStore } from '../../hooks/useSimpleStoreSyncedValue'
import type { LocalizationContextValue, SupportedLocalesConfig } from './LocalizationContext'
import { StringUnionUtils } from '../../utils/stringUnion'
import { CalendarTypeUtils, DateUtils, type CalendarType, type Weekday } from '../../utils/date'

const localizationHourFormats = ['24h', '12h'] as const
type LocalizationHourFormat = typeof localizationHourFormats[number]

const hightideDefaultIs24HourFormat = true
const hightideDefaultStartingWeekday: Weekday = 'monday'
const hightideDefaultCalendarType: CalendarType = 'Gregorian'

export type UseCreateLocalizationContextProps = {
  store: SimpleValueStore,
  fallbackLocale: string,
  supportedLocales: SupportedLocalesConfig,
  fallbackTimeZone?: string,
  fallbackIs24HourFormat?: boolean,
  fallbackStartingWeekday?: Weekday,
  fallbackCalendarType?: CalendarType,
  locale?: string,
  systemLocale?: string,
  timeZone?: string,
  is24HourFormat?: boolean,
  startingWeekday?: Weekday,
  calendarType?: CalendarType,
  onChangedLocale?: (locale: string) => void,
  onChangedTimeZone?: (timeZone: string | undefined) => void,
  onChangedIs24HourFormat?: (is24HourFormat: boolean) => void,
  onChangedStartingWeekday?: (startingWeekday: Weekday) => void,
  onChangedCalendarType?: (calendarType: CalendarType) => void,
}

export const useCreateLocalizationContext = ({
  store,
  fallbackLocale,
  supportedLocales,
  fallbackTimeZone,
  fallbackIs24HourFormat,
  fallbackStartingWeekday,
  fallbackCalendarType,
  locale,
  systemLocale,
  timeZone,
  is24HourFormat,
  startingWeekday,
  calendarType,
  onChangedLocale,
  onChangedTimeZone,
  onChangedIs24HourFormat,
  onChangedStartingWeekday,
  onChangedCalendarType,
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
  const {
    value: storedStartingWeekday,
    setValue: setStoredStartingWeekday,
    deleteValue: deleteStoredStartingWeekday,
  } = useSimpleStoreSyncedValue<Weekday>({
    store,
    key: 'startingWeekday',
    decode: useCallback((value: string) => {
      if (StringUnionUtils.isUnionValue(value, DateUtils.weekDayList)) return value
      return null
    }, []),
    encode: useCallback((value) => value, []),
  })
  const {
    value: storedCalendarType,
    setValue: setStoredCalendarType,
    deleteValue: deleteStoredCalendarType,
  } = useSimpleStoreSyncedValue<CalendarType>({
    store,
    key: 'calendarType',
    decode: useCallback((value: string) => {
      if (CalendarTypeUtils.typeCheck(value)) return value
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

  const localeDefaults = supportedLocales[resolvedLocale]

  const resolvedTimeZone = useMemo(() => {
    return timeZone ?? storedTimeZone ?? localeDefaults?.defaultTimeZone ?? fallbackTimeZone
  }, [timeZone, storedTimeZone, localeDefaults?.defaultTimeZone, fallbackTimeZone])

  useEffect(() => {
    if (timeZone === undefined) return
    setStoredTimeZone(timeZone)
  }, [timeZone, setStoredTimeZone])

  const resolvedIs24HourFormat: boolean = useMemo(() => {
    const storedIs24HourFormat = hourFormat === null ? null : hourFormat === '24h'
    return is24HourFormat
      ?? storedIs24HourFormat
      ?? localeDefaults?.defaultIs24HourFormat
      ?? fallbackIs24HourFormat
      ?? hightideDefaultIs24HourFormat
  }, [is24HourFormat, hourFormat, localeDefaults?.defaultIs24HourFormat, fallbackIs24HourFormat])

  useEffect(() => {
    if (is24HourFormat === undefined) return
    setStoredHourFormat(is24HourFormat ? '24h' : '12h')
  }, [is24HourFormat, setStoredHourFormat])

  const resolvedStartingWeekday: Weekday = useMemo(() => {
    return startingWeekday
      ?? storedStartingWeekday
      ?? localeDefaults?.defaultStartingWeekday
      ?? fallbackStartingWeekday
      ?? hightideDefaultStartingWeekday
  }, [startingWeekday, storedStartingWeekday, localeDefaults?.defaultStartingWeekday, fallbackStartingWeekday])

  useEffect(() => {
    if (startingWeekday === undefined) return
    setStoredStartingWeekday(startingWeekday)
  }, [startingWeekday, setStoredStartingWeekday])

  const resolvedCalendarType: CalendarType = useMemo(() => {
    return calendarType
      ?? storedCalendarType
      ?? localeDefaults?.defaultCalendarType
      ?? fallbackCalendarType
      ?? hightideDefaultCalendarType
  }, [calendarType, storedCalendarType, localeDefaults?.defaultCalendarType, fallbackCalendarType])

  useEffect(() => {
    if (calendarType === undefined) return
    setStoredCalendarType(calendarType)
  }, [calendarType, setStoredCalendarType])

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

  const onChangeStartingWeekdayRef = useEventCallbackStabilizer(onChangedStartingWeekday)

  useEffect(() => {
    onChangeStartingWeekdayRef?.(resolvedStartingWeekday)
  }, [resolvedStartingWeekday, onChangeStartingWeekdayRef])

  const onChangeCalendarTypeRef = useEventCallbackStabilizer(onChangedCalendarType)

  useEffect(() => {
    onChangeCalendarTypeRef?.(resolvedCalendarType)
  }, [resolvedCalendarType, onChangeCalendarTypeRef])

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

  const setStartingWeekday = useCallback((newStartingWeekday: Weekday | null) => {
    if (startingWeekday !== undefined) {
      console.warn(
        'useCreateLocalizationContext: Attempting to change the starting weekday while setting a fixed starting weekday won\'t have any effect. '
          + 'Change the startingWeekday provided to the LocalizationProvider instead.'
      )
      return
    }
    if (newStartingWeekday === null) {
      deleteStoredStartingWeekday()
    } else {
      setStoredStartingWeekday(newStartingWeekday)
    }
  }, [deleteStoredStartingWeekday, setStoredStartingWeekday, startingWeekday])

  const setCalendarType = useCallback((newCalendarType: CalendarType | null) => {
    if (calendarType !== undefined) {
      console.warn(
        'useCreateLocalizationContext: Attempting to change the calendar type while setting a fixed calendar type won\'t have any effect. '
          + 'Change the calendarType provided to the LocalizationProvider instead.'
      )
      return
    }
    if (newCalendarType === null) {
      deleteStoredCalendarType()
    } else {
      setStoredCalendarType(newCalendarType)
    }
  }, [calendarType, deleteStoredCalendarType, setStoredCalendarType])

  return {
    locale: resolvedLocale,
    setLocale,
    supportedLocales,
    timeZone: resolvedTimeZone,
    setTimeZone,
    is24HourFormat: resolvedIs24HourFormat,
    setIs24HourFormat,
    startingWeekday: resolvedStartingWeekday,
    setStartingWeekday,
    calendarType: resolvedCalendarType,
    setCalendarType,
    isInitialized: store.isInitialized,
  }
}
