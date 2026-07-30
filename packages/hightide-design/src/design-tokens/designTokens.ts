import type { HightideComponentTokens } from '../component-tokens/componentTokens'
import type { HightideSemanticTokens } from '../semantic-tokens/semanticTokens'

export type HightideDesignTokens = HightideSemanticTokens & {
  components: HightideComponentTokens,
}
