import { themes as designThemes } from '@helpwave/hightide-design/tokens'
import { createDesignTheme } from './createTheme'

export const lightTheme = createDesignTheme(designThemes.light)

export const darkTheme = createDesignTheme(designThemes.dark)

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const

export type ThemeMode = keyof typeof themes

export const getTheme = (mode: ThemeMode) => themes[mode]
