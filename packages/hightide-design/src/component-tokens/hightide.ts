import {
  hightideDarkSemanticTokens,
  hightideLightSemanticTokens
} from '../semantic-tokens/hightide'
import { toHightideComponentTokens } from './toComponentTokens'

export const hightideLightComponentTokens = toHightideComponentTokens({
  semanticTokens: hightideLightSemanticTokens,
})

export const hightideDarkComponentTokens = toHightideComponentTokens({
  semanticTokens: hightideDarkSemanticTokens,
})
