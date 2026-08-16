import { hightideDesignSystem } from '@helpwave/hightide-design/design-system'
import { createHightideTheme } from './createHightideTheme'

export const hightideLightTheme = createHightideTheme(
  hightideDesignSystem.tokenThemes.light
)
export const hightideDarkTheme = createHightideTheme(
  hightideDesignSystem.tokenThemes.dark
)

export const themes = {
  light: hightideLightTheme,
  dark: hightideDarkTheme,
} as const

export type HightideThemeModes = 'dark' | 'light'

export type ThemeMode = string | HightideThemeModes
