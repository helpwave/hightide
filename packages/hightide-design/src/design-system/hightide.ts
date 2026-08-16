import { hightidePrimitiveTokens } from '../primitive-tokens/hightide'
import {
  hightideDarkThemeTokens,
  hightideLightThemeTokens
} from '../theme-tokens/hightide'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { HightidePrimitiveTokens } from '../primitive-tokens/hightide'

export type HightideDesignSystem = {
  primitives: HightidePrimitiveTokens,
  tokenThemes: {
    light: ThemeTokens,
    dark: ThemeTokens,
  },
}

export const hightideDesignSystem = {
  primitives: hightidePrimitiveTokens,
  tokenThemes: {
    light: hightideLightThemeTokens,
    dark: hightideDarkThemeTokens,
  },
} as const satisfies HightideDesignSystem
