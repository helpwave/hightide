import { hightideDesignSystem } from '@helpwave/hightide-design/design-system'
import { createHightideTheme } from './createHightideTheme'

export const hightideLightTheme = createHightideTheme(
  hightideDesignSystem.themes.light,
  hightideDesignSystem.primitives
)
export const hightideDarkTheme = createHightideTheme(
  hightideDesignSystem.themes.dark,
  hightideDesignSystem.primitives
)

export const themes = {
  light: hightideLightTheme,
  dark: hightideDarkTheme,
} as const

export type HightideThemeModes = 'dark' | 'light'

export type ThemeMode = string | HightideThemeModes
