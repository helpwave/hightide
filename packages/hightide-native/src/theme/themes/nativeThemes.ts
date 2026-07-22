import { Themes as designThemes } from '@helpwave/hightide-design/tokens'

import { createTheme } from '@/src/theme/themes/createTheme'

export const lightTheme = createTheme(designThemes.light)

export const darkTheme = createTheme(designThemes.dark)

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const

export type HightideThemeModes = 'dark' | 'light'

export type ThemeMode = string | HightideThemeModes