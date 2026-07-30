import type { HightideComponentTokens } from '../component-tokens/componentTokens'
import type { HightidePrimitiveTokens } from '../primitive-tokens/primitiveTokens'
import type { HightideSemanticTokens } from '../semantic-tokens/semanticTokens'
import type { HightideThemeTokens } from '../theme-tokens'

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
