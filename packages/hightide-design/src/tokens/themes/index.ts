import { darkTheme } from './dark'
import { lightTheme } from './light'
import type { DesignThemes } from '../../types'

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const satisfies DesignThemes
