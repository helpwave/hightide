import { colorPalettes } from '../color-palettes'
import { constructThemeTokens } from '../../utils/constructThemeTokens'
import type { HightideThemeTokens } from '../../types/hightide'
import { toHightideComponentTokens } from '../mappings/to-components'
import { toHightideSemanticTokens } from '../mappings/to-semantic'
import { toHightideTheme } from '../mappings/to-theme'

export const darkTheme = constructThemeTokens({
  themeName: 'dark',
  primitiveTokens: colorPalettes,
  toSemantic: toHightideSemanticTokens,
  toComponents: toHightideComponentTokens,
  toTheme: toHightideTheme,
}) satisfies HightideThemeTokens
