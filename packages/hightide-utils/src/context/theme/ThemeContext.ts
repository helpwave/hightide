import { createContext, useContext } from 'react'

export type ThemeInformation = {
  theme: string,
  nameTranslations: Record<string, string>,
}

export const resolveThemeName = (themeInformation: ThemeInformation, locale: string): string => (
  themeInformation.nameTranslations[locale]
    ?? Object.values(themeInformation.nameTranslations)[0]
    ?? themeInformation.theme
)

export type ThemeContextValue = {
  theme: string,
  setTheme: (theme: string) => void,
  supportedThemes: readonly ThemeInformation[],
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeContext. Try adding a ThemeProvider around your app.'
    )
  }
  return context
}
