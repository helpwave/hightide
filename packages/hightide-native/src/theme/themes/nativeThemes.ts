import { Themes as designThemes } from '@helpwave/hightide-design/tokens'
import { createTheme } from './createTheme'

export const lightTheme = createTheme(designThemes.light)

export const darkTheme = createTheme(designThemes.dark)

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const

export type ThemeMode = keyof typeof themes

export const getTheme = (mode: ThemeMode) => themes[mode]
