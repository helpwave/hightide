import type { DesignTokens } from '@/src/types'
import { darkTheme } from './dark'
import { lightTheme } from './light'

export const Themes = {
  light: lightTheme,
  dark: darkTheme,
} as const satisfies Record<string, DesignTokens>
