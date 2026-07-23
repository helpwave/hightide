import { ThemeTokens as designThemes } from '@helpwave/hightide-design/tokens'
import { createHightideTheme } from './createHightideTheme'

export const lightTheme = createHightideTheme(designThemes.light)
export const darkTheme = createHightideTheme(designThemes.dark)

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const

export type HightideThemeModes = 'dark' | 'light'

export type ThemeMode = string | HightideThemeModes