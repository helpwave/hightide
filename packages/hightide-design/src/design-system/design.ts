import type { HightideComponentTokens } from '../components/componentTokens'
import type { HightidePrimitiveTokens } from '../primitive/primitiveTokens'
import type { HightideSemanticTokens } from '../semantic/semanticTokens'
import type { HightideThemeTokens } from '../theme'

export type HightideDesignSystemTokens = {
  theme: HightideThemeTokens,
  semantic: HightideSemanticTokens,
  components: HightideComponentTokens,
}

export type HightideDesignSystem = {
  primitives: HightidePrimitiveTokens,
  themes: Record<string, HightideDesignSystemTokens> & {
    light: HightideDesignSystemTokens,
    dark: HightideDesignSystemTokens,
  },
}
