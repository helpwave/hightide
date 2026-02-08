import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useStorage } from '../hooks/useStorage'
import { LocalizationUtil } from '../i18n/util'
import type { HightideTranslationLocales } from '@/src/i18n/translations'
import type { LocalizationConfig } from '@/src/global-contexts/HightideConfigContext'
import { useHightideConfig } from '@/src/global-contexts/HightideConfigContext'
import { useEventCallbackStabilizer } from '../hooks/useEventCallbackStabelizer'

export type LocaleContextValue = {
  locale: HightideTranslationLocales,
  setLocale: Dispatch<SetStateAction<HightideTranslationLocales>>,
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

type LocaleWithSystem = HightideTranslationLocales | 'system'

export type LocaleProviderProps = PropsWithChildren & Partial<LocalizationConfig> & {
  locale?: LocaleWithSystem,
  onChangedLocale?: (locale: HightideTranslationLocales) => void,
}

export const LocaleProvider = ({
  children,
  locale,
  defaultLocale,
  onChangedLocale
}: LocaleProviderProps) => {
  const {
    value: storedLocale,
    setValue: setStoredLocale,
    deleteValue: deleteStoredLocale,
  } = useStorage<LocaleWithSystem>({ key: 'locale', defaultValue: 'system' })
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

  const onChangeRef = useEventCallbackStabilizer(onChangedLocale)

  useEffect(() => {
    onChangeRef?.(resolvedLocale)
  }, [resolvedLocale, onChangeRef])

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
      }
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

export const useLanguage = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLanguage must be used within LocaleContext. Try adding a LocaleProvider around your app.')
  }
  return { language: LocalizationUtil.localToLanguage(context.locale) }
}
