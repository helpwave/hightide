import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
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

export const useLanguage = () => useContext(LanguageContext)

export const useLocale = (overWriteLanguage?: Language) => {
  const { language } = useLanguage()
  const mapping: Record<Language, string> = {
    en: 'en-US',
    de: 'de-DE'
  }
  return mapping[overWriteLanguage ?? language]
}

type LanguageProviderProps = {
  initialLanguage?: Language,
}

export const LanguageProvider = ({ initialLanguage, children }: PropsWithChildren<LanguageProviderProps>) => {
  const [language, setLanguage] = useState<Language>(initialLanguage ?? LanguageUtil.DEFAULT_LANGUAGE)
  const [storedLanguage, setStoredLanguage] = useLocalStorage<Language>('language', initialLanguage ?? LanguageUtil.DEFAULT_LANGUAGE)

  useEffect(() => {
    if (language !== initialLanguage && initialLanguage) {
      console.warn('LanguageProvider initial state changed: Prefer using languageProvider\'s setLanguage instead')
      setLanguage(initialLanguage)
    }
  }, [initialLanguage]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // TODO set locale of html tag here as well
    setStoredLanguage(language)
  }, [language, setStoredLanguage])

  useEffect(() => {
    if (storedLanguage !== null) {
      setLanguage(storedLanguage)
      return
    }

    const LanguageToTestAgainst = Object.values(LanguageUtil.languages)

    const matchingBrowserLanguage = window.navigator.languages
      .map(language => LanguageToTestAgainst.find((test) => language === test || language.split('-')[0] === test))
      .filter(entry => entry !== undefined)

    if (matchingBrowserLanguage.length === 0) return

    const firstMatch = matchingBrowserLanguage[0] as Language
    setLanguage(firstMatch)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  )
}