import {
  hightideDarkComponentTokens,
  hightideLightComponentTokens
} from '../component-tokens/hightide'
import {
  hightideDarkSemanticTokens,
  hightideLightSemanticTokens
} from '../semantic-tokens/hightide'
import type { HightideDesignTokens } from './designTokens'

export const hightideLightDesignTokens = {
  ...hightideLightSemanticTokens,
  components: hightideLightComponentTokens,
} as const satisfies HightideDesignTokens

export const hightideDarkDesignTokens = {
  ...hightideDarkSemanticTokens,
  components: hightideDarkComponentTokens,
} as const satisfies HightideDesignTokens
