import type { HightideThemeTokens } from '../../types/hightide'
import { darkTheme } from './dark'
import { lightTheme } from './light'

export const ThemeTokens = {
  light: lightTheme,
  dark: darkTheme,
} as const satisfies Record<string, HightideThemeTokens>
