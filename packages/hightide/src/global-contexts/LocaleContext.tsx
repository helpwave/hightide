import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useStorage } from '../hooks/useStorage'
import { LocalizationUtil } from '../i18n/util'
import type { HightideTranslationLocales } from '@/src/i18n/translations'
import type { LocalizationConfig } from '@/src/global-contexts/HightideConfigContext'
import { useHightideConfig } from '@/src/global-contexts/HightideConfigContext'
import { useEventCallbackStabilizer } from '@helpwave/hightide-utils'

type LocaleWithSystem = HightideTranslationLocales | 'system'

export type LocaleContextValue = {
  locale: HightideTranslationLocales,
  setLocale: Dispatch<SetStateAction<LocaleWithSystem>>,
  timeZone?: string,
  setTimeZone?: (timeZone: string | undefined) => void,
  is24HourFormat?: boolean,
  setIs24HourFormat?: (is24HourFormat: boolean | undefined) => void,
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export type LocaleProviderProps = PropsWithChildren & Partial<LocalizationConfig> & {
  locale?: LocaleWithSystem,
  onChangedLocale?: (locale: HightideTranslationLocales) => void,
  timeZone?: string,
  onChangedTimeZone?: (timeZone: string | undefined) => void,
  is24HourFormat?: boolean,
  onChangedIs24HourFormat?: (is24HourFormat: boolean) => void,
}

export const LocaleProvider = ({
  children,
  locale,
  defaultLocale,
  defaultTimeZone,
  defaultIs24HourFormat,
  timeZone,
  is24HourFormat,
  onChangedLocale,
  onChangedTimeZone,
  onChangedIs24HourFormat,
}: LocaleProviderProps) => {
  const {
    value: storedLocale,
    setValue: setStoredLocale,
    deleteValue: deleteStoredLocale,
  } = useStorage<LocaleWithSystem>({ key: 'locale', defaultValue: 'system' })
  const {
    value: storedTimeZone,
    setValue: setStoredTimeZone,
    deleteValue: deleteStoredTimeZone,
  } = useStorage<string | null>({ key: 'timeZone', defaultValue: null })
  const {
    value: storedIs24HourFormat,
    setValue: setStoredIs24HourFormat,
    deleteValue: deleteStoredIs24HourFormat,
  } = useStorage<boolean | null>({ key: 'is24HourFormat', defaultValue: null })
  const { config } = useHightideConfig()
  const [localePreference, setLocalePreference] = useState<LocaleWithSystem>('system')

  const resolvedLocale = useMemo(() => {
    if (locale && locale !== 'system') {
      return locale
    }
    if (storedLocale && storedLocale !== 'system') {
      return storedLocale
    }
    if (localePreference !== 'system') {
      return localePreference
    }
    return config.locale.defaultLocale ?? defaultLocale
  }, [config.locale.defaultLocale, defaultLocale, locale, localePreference, storedLocale])

  useEffect(() => {
    if (!locale) return
    if (locale === 'system') {
      deleteStoredLocale()
    } else {
      setStoredLocale(locale)
    }
  }, [locale, deleteStoredLocale, setStoredLocale])

  const resolvedTimeZone = useMemo(() => {
    return timeZone ?? storedTimeZone ?? config.locale.defaultTimeZone ?? defaultTimeZone
  }, [timeZone, storedTimeZone, config.locale.defaultTimeZone, defaultTimeZone])

  useEffect(() => {
    if (timeZone === undefined) return
    setStoredTimeZone(timeZone)
  }, [timeZone, setStoredTimeZone])

  const resolvedIs24HourFormat = useMemo(() => {
    return is24HourFormat ?? storedIs24HourFormat ?? config.locale.defaultIs24HourFormat ?? defaultIs24HourFormat ?? true
  }, [is24HourFormat, storedIs24HourFormat, config.locale.defaultIs24HourFormat, defaultIs24HourFormat])

  useEffect(() => {
    if (is24HourFormat === undefined) return
    setStoredIs24HourFormat(is24HourFormat)
  }, [is24HourFormat, setStoredIs24HourFormat])

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

  useEffect(() => {
    const localesToTestAgainst = Object.values(LocalizationUtil.locals)

    const detectLanguage = () => {
      const matchingBrowserLanguage = window.navigator.languages
        .map(locale =>
          localesToTestAgainst.find(
            (test) => locale === test || locale.split('-')[0] === LocalizationUtil.localToLanguage(test)
          ))
        .filter((entry): entry is HightideTranslationLocales => entry !== undefined)

      if (matchingBrowserLanguage.length === 0) return

      const firstMatch = matchingBrowserLanguage[0]
      setLocalePreference(firstMatch)
    }
    detectLanguage()

    window.addEventListener('languagechange', detectLanguage)
    return () => {
      window.removeEventListener('languagechange', detectLanguage)
    }
  }, [])

  return (
    <LocaleContext.Provider value={{
      locale: resolvedLocale,
      setLocale: (newLocale) => {
        if (locale !== 'system') {
          console.warn('LocaleProvider: Attempting to change the ' +
            "locale while setting a fixed locale won't have any effect. " +
            'Change the locale provided to the LocaleProvider instead.')
        }
        setStoredLocale(newLocale)
      },
      timeZone: resolvedTimeZone,
      setTimeZone: (newTimeZone) => {
        if (timeZone !== undefined) {
          console.warn('LocaleProvider: Attempting to change the ' +
            "time zone while setting a fixed time zone won't have any effect. " +
            'Change the timeZone provided to the LocaleProvider instead.')
          return
        }
        if (newTimeZone === undefined) {
          deleteStoredTimeZone()
        } else {
          setStoredTimeZone(newTimeZone)
        }
      },
      is24HourFormat: resolvedIs24HourFormat,
      setIs24HourFormat: (newIs24HourFormat) => {
        if (is24HourFormat !== undefined) {
          console.warn('LocaleProvider: Attempting to change the ' +
            "hour format while setting a fixed hour format won't have any effect. " +
            'Change the is24HourFormat provided to the LocaleProvider instead.')
          return
        }
        if (newIs24HourFormat === undefined) {
          deleteStoredIs24HourFormat()
        } else {
          setStoredIs24HourFormat(newIs24HourFormat)
        }
      },
    }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleContext. Try adding a LocaleProvider around your app.')
  }
  return context
}

export const useTimeZone = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useTimeZone must be used within LocaleContext. Try adding a LocaleProvider around your app.')
  }
  return { timeZone: context.timeZone, setTimeZone: context.setTimeZone }
}

export const useDateTimeFormat = () => {
  const context = useContext(LocaleContext)
  return {
    is24HourFormat: context?.is24HourFormat ?? true,
    timeZone: context?.timeZone,
  }
}

export const useLanguage = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLanguage must be used within LocaleContext. Try adding a LocaleProvider around your app.')
  }
  return { language: LocalizationUtil.localToLanguage(context.locale) }
}
