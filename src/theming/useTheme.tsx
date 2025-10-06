import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Translation, TranslationPlural } from '../localization/useTranslation'
import { useLocalStorage } from '../hooks/useLocalStorage'

const themes = ['light', 'dark', 'system'] as const

export type ThemeType = typeof themes[number]
export type ResolvedTheme = Exclude<ThemeType, 'system'>

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
  resolvedTheme: ResolvedTheme,
  setTheme: Dispatch<SetStateAction<ThemeType>>,
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

type ThemeProviderProps = {
  /**
   * Only set this if you want to control the theme yourself
   */
  theme?: ThemeType,
}

export const ThemeProvider = ({ children, theme }: PropsWithChildren<ThemeProviderProps>) => {
  const {
    value: storedTheme,
    setValue: setStoredTheme,
    deleteValue: deleteStoredTheme
  } = useLocalStorage<ThemeType>('theme', 'system')
  const [themePreference, setThemePreference] = useState<ThemeType>('system')

  const resolvedTheme = useMemo((): ResolvedTheme => {
    if (theme && theme !== 'system') {
      return theme
    }
    if (storedTheme && storedTheme !== 'system') {
      return storedTheme
    }
    if (themePreference !== 'system') {
      return themePreference
    }
    return 'light'
  }, [storedTheme, theme, themePreference])

  useEffect(() => {
    if (theme === 'system') {
      deleteStoredTheme()
    } else {
      setStoredTheme(theme)
    }
  }, [theme]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
  }, [resolvedTheme])

  const getPreference = useCallback(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    setThemePreference(prefersDark ? 'dark' : (prefersLight ? 'light' : 'system'))
  }, [])

  useEffect(() => {
    getPreference()
  }, [getPreference])

  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)')
    const noPrefQuery = window.matchMedia('(prefers-color-scheme: no-preference)')
    darkQuery.addEventListener('change', getPreference)
    lightQuery.addEventListener('change', getPreference)
    noPrefQuery.addEventListener('change', getPreference)
    return () => {
      darkQuery.removeEventListener('change', getPreference)
      lightQuery.removeEventListener('change', getPreference)
      noPrefQuery.removeEventListener('change', getPreference)
    }
  }, [getPreference])

  return (
    <ThemeContext.Provider
      value={{
        theme: storedTheme,
        resolvedTheme,
        setTheme: (newTheme) => {
          if (theme) {
            console.warn('ThemeProvider: Attempting to change the ' +
              "theme while setting a fixed theme won't have any effect. " +
              'Change the theme provided to the ThemeProvider instead.')
          }
          setStoredTheme(newTheme)
        }
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeContext. Try adding a ThemeProvider around your app.')
  }
  return context
}
