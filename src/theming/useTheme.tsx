import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Translation } from '../localization/useTranslation'
import { noop } from '../util/noop'

const themes = ['light', 'dark'] as const

export type ThemeType = typeof themes[number]

export type ThemeTypeTranslation = Record<ThemeType, string>

const defaultThemeTypeTranslation: Translation<ThemeTypeTranslation> = {
  en: {
    dark: 'Dark',
    light: 'Light'
  },
  de: {
    dark: 'Dunkel',
    light: 'Hell'
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

export const ThemeProvider = ({ children, initialTheme = 'light' }: PropsWithChildren<ThemeProviderProps>) => {
  const [theme, setTheme] = useState<ThemeType>(initialTheme)

  useEffect(() => {
    if (theme !== initialTheme) {
      console.warn('ThemeProvider initial state changed: Prefer using useTheme\'s setTheme instead')
      setTheme(initialTheme)
    }
  }, [initialTheme]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}


export const useTheme = () => useContext(ThemeContext)
