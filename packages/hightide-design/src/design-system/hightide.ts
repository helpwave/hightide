import {
  hightideDarkDesignTokens,
  hightideLightDesignTokens
} from '../design-tokens/hightide'
import { hightidePrimitiveTokens } from '../primitive-tokens/hightide'
import { hightideDarkThemeTokens, hightideLightThemeTokens } from '../theme-tokens/hightide'
import type { HightideDesignSystem, HightideDesignSystemTokens } from './design'

export const hightideLightDesignSystemTokens = {
  theme: hightideLightThemeTokens,
  ...hightideLightDesignTokens,
} as const satisfies HightideDesignSystemTokens

export const hightideDarkDesignSystemTokens = {
  theme: hightideDarkThemeTokens,
  ...hightideDarkDesignTokens,
} as const satisfies HightideDesignSystemTokens

export const hightideDesignSystem = {
  primitives: hightidePrimitiveTokens,
  tokenThemes: {
    light: hightideLightDesignSystemTokens,
    dark: hightideDarkDesignSystemTokens,
  },
} as const satisfies HightideDesignSystem
