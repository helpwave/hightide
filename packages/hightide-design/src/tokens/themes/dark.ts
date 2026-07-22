import { colorPalettes } from '../color-palettes'
import { constructTheme } from '../../hooks/constructTheme'
import type { HightideDesignTokens } from '../../types'
import {
  toHightideComponentTokens,
  toHightideSemanticTokens,
  toHightideTheme
} from './mappings'

export const darkTheme = constructTheme({
  themeName: 'dark',
  primitiveTokens: colorPalettes,
  toSemantic: toHightideSemanticTokens,
  toComponents: toHightideComponentTokens,
  toTheme: toHightideTheme,
}) satisfies HightideDesignTokens
