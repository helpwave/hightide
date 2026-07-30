import {
  hightideDarkThemeTokens,
  hightideLightThemeTokens
} from '../theme/hightide'
import { toHightideSemanticTokens } from './toSemantic'

export const hightideLightSemanticTokens = toHightideSemanticTokens({
  themeTokens: hightideLightThemeTokens,
})

export const hightideDarkSemanticTokens = toHightideSemanticTokens({
  themeTokens: hightideDarkThemeTokens,
})
