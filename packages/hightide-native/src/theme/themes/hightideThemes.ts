import { designSystem } from '@helpwave/hightide-design/design-system'
import { createHightideTheme } from './createHightideTheme'

export const lightTheme = createHightideTheme(
  designSystem.themes.light,
  designSystem.primitives
)
export const darkTheme = createHightideTheme(
  designSystem.themes.dark,
  designSystem.primitives
)

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const

export type HightideThemeModes = 'dark' | 'light'

export type ThemeMode = string | HightideThemeModes
