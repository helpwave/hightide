import { hightideDarkComponentTokens, hightideLightComponentTokens } from '../components/hightide'
import { hightidePrimitiveTokens } from '../primitive/primitiveTokens'
import { hightideDarkSemanticTokens, hightideLightSemanticTokens } from '../semantic/hightide'
import { hightideDarkThemeTokens, hightideLightThemeTokens } from '../theme/hightide'
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
