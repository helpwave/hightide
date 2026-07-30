import { hightideDarkComponentTokens, hightideLightComponentTokens } from '../component-tokens/hightide'
import { hightidePrimitiveTokens } from '../primitive-tokens/primitiveTokens'
import { hightideDarkSemanticTokens, hightideLightSemanticTokens } from '../semantic-tokens/hightide'
import { hightideDarkThemeTokens, hightideLightThemeTokens } from '../theme-tokens/hightide'
import type { HightideDesignSystem, HightideDesignSystemTokens } from './design'

export const hightideLightTheme = {
  theme: hightideLightThemeTokens,
  semantic: hightideLightSemanticTokens,
  components: hightideLightComponentTokens,
} as const satisfies HightideDesignSystemTokens

export const hightideDarkTheme = {
  theme: hightideDarkThemeTokens,
  semantic: hightideDarkSemanticTokens,
  components: hightideDarkComponentTokens,
} as const satisfies HightideDesignSystemTokens

export const hightideDesignSystem = {
  primitives: hightidePrimitiveTokens,
  themes: {
    light: hightideLightTheme,
    dark: hightideDarkTheme,
  },
} as const satisfies HightideDesignSystem
