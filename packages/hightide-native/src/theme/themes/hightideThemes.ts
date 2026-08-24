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

import type { HightideThemeModes } from '../../enums/hightideThemeModes'

export type { HightideThemeModes }

export type ThemeMode = string | HightideThemeModes
