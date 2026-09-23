import { hightideDesignSystem } from '@helpwave/hightide-design/design-system'
import { createHightideTheme } from './createHightideTheme'

export const hightideLightTheme = createHightideTheme(
  hightideDesignSystem.themes.light
)
export const hightideDarkTheme = createHightideTheme(
  hightideDesignSystem.themes.dark
)

export const themes = {
  light: hightideLightTheme,
  dark: hightideDarkTheme,
} as const

import type { HightideThemeModes } from '../../enums/hightideThemeModes'

export type { HightideThemeModes }

export type ThemeMode = string | HightideThemeModes
