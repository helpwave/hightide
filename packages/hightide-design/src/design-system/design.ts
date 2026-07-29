import type { ComponentTokens } from '../components/component-tokens'
import type { PrimitiveTokens } from '../primitive/primitive-tokens'
import type { SemanticTokens } from '../semantic/semantic-tokens'

export type DesignSystemTokens = {
  semantic: SemanticTokens,
  components: ComponentTokens,
}

export type DesignSystem = {
  primitives: PrimitiveTokens,
  themes: Record<string, DesignSystemTokens> & {
    light: DesignSystemTokens,
    dark: DesignSystemTokens,
  },
}
