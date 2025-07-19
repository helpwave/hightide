import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { useMemo } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Translation, TranslationPlural } from '../localization/useTranslation'
import { noop } from '../util/noop'
import { useLocalStorage } from '../hooks/useLocalStorage'

const themes = ['light', 'dark', 'system'] as const

export type ThemeType = typeof themes[number]

export type ThemeTypeTranslation = Record<ThemeType, string> & {
  theme: TranslationPlural,
}

const defaultThemeTypeTranslation: Translation<ThemeTypeTranslation> = {
  en: {
    dark: 'Dark',
    light: 'Light',
    system: 'System',
    theme: {
      one: 'Theme',
      other: 'Themes'
    }
  },
  de: {
    dark: 'Dunkel',
    light: 'Hell',
    system: 'System',
    theme: {
      one: 'Farbschema',
      other: 'Farbschemas'
    }
  }
}

export const ThemeUtil = {
  themes,
  translation: defaultThemeTypeTranslation,
}

type ThemeContextType = {
  theme: ThemeType,
  setTheme: Dispatch<SetStateAction<ThemeType>>,
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: noop
})

type ThemeProviderProps = {
  initialTheme?: ThemeType,
}

export const ThemeProvider = ({ children, initialTheme }: PropsWithChildren<ThemeProviderProps>) => {
  const [storedTheme, setStoredTheme] = useLocalStorage<ThemeType>('theme', initialTheme ?? 'system')
  const [userTheme, setUserTheme] = useState<ThemeType>()

  useEffect(() => {
    if (!!initialTheme && storedTheme !== initialTheme) {
      console.warn('ThemeProvider initial state changed: Prefer using useTheme\'s setTheme instead')
      setStoredTheme(initialTheme)
    }
  }, [initialTheme]) // eslint-disable-line react-hooks/exhaustive-deps

  const usedTheme = useMemo(() => storedTheme !== 'system' ? storedTheme : userTheme, [storedTheme, userTheme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', usedTheme)
  }, [usedTheme])

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setUserTheme(prefersDark ? 'dark' : 'light')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: storedTheme, setTheme: setStoredTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}


export const useTheme = () => useContext(ThemeContext)
