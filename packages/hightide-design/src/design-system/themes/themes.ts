import { hightidePrimitiveTokens } from '../../primitive/primitive-tokens'
import type { DesignSystem } from '../design'
import { darkTheme } from './dark'
import { lightTheme } from './light'

export const designSystem = {
  primitives: hightidePrimitiveTokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
} as const satisfies DesignSystem
