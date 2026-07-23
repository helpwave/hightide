import { colorPalettes } from '../color-palettes'
import { constructTheme } from '../../hooks/constructTheme'
import type { HightideDesignTokens } from '../../types/hightide'
import { toHightideComponentTokens } from './mappings/to-components'
import { toHightideSemanticTokens } from './mappings/to-semantic'
import { toHightideTheme } from './mappings/to-theme'

export const lightTheme = constructTheme({
  themeName: 'light',
  primitiveTokens: colorPalettes,
  toSemantic: toHightideSemanticTokens,
  toComponents: toHightideComponentTokens,
  toTheme: toHightideTheme,
}) satisfies HightideDesignTokens
