import type { HightideDesignTokens } from '../../types/hightide'
import { darkTheme } from './dark'
import { lightTheme } from './light'

export const Themes = {
  light: lightTheme,
  dark: darkTheme,
} as const satisfies Record<string, HightideDesignTokens>
