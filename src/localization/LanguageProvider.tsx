import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Language } from './util'
import { LanguageUtil } from './util'

export type LanguageContextValue = {
  language: Language,
  setLanguage: Dispatch<SetStateAction<Language>>,
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: LanguageUtil.DEFAULT_LANGUAGE,
  setLanguage: (v) => v
})

type LanguageWithSystem = Language | 'system'

type LanguageProviderProps = {
  language?: LanguageWithSystem,
}

export const LanguageProvider = ({ children, language }: PropsWithChildren<LanguageProviderProps>) => {
  const {
    value: storedLanguage,
    setValue: setStoredLanguage,
    deleteValue: deleteStoredLanguage
  } = useLocalStorage<LanguageWithSystem>('language', 'system')
  const [languagePreference, setLanguagePreference] = useState<LanguageWithSystem>('system')

  const resolvedLanguage = useMemo(() => {
    if (language && language !== 'system') {
      return language
    }
    if (storedLanguage && storedLanguage !== 'system') {
      return storedLanguage
    }
    if (languagePreference !== 'system') {
      return languagePreference
    }
    return LanguageUtil.DEFAULT_LANGUAGE
  }, [language, languagePreference, storedLanguage])

  useEffect(() => {
    if(!language) return
    if (language === 'system') {
      deleteStoredLanguage()
    } else {
      setStoredLanguage(language)
    }
  }, [language]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const LanguageToTestAgainst = Object.values(LanguageUtil.languages)

    const detectLanguage = () => {
      const matchingBrowserLanguage = window.navigator.languages
        .map(language =>
          LanguageToTestAgainst.find(
            (test) => language === test || language.split('-')[0] === test
          ))
        .filter((entry): entry is Language => entry !== undefined)

      if (matchingBrowserLanguage.length === 0) return

      const firstMatch = matchingBrowserLanguage[0]
      setLanguagePreference(firstMatch)
    }
    detectLanguage()

    window.addEventListener('languagechange', detectLanguage)
    return () => {
      window.removeEventListener('languagechange', detectLanguage)
    }
  }, [])

  return (
    <LanguageContext.Provider value={{
      language: resolvedLanguage,
      setLanguage: (newLanguage) => {
        if (language !== 'system') {
          console.warn('LanguageProvider: Attempting to change the ' +
            "language while setting a fixed language won't have any effect. " +
            'Change the language provided to the LanguageProvider instead.')
        }
        setStoredLanguage(newLanguage)
      }
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageContext. Try adding a LanguageProvider around your app.')
  }
  return context
}

export const useLocale = (overWriteLanguage?: Language) => {
  const { language } = useLanguage()
  const mapping: Record<Language, string> = {
    en: 'en-US',
    de: 'de-DE'
  }
  return mapping[overWriteLanguage ?? language]
}
