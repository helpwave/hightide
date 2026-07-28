import { hightidePrimitiveTokens } from '../../primitive/primitive-tokens'
import { toHightideSemanticTokens } from '../../semantic/to-semantic'
import { constructThemeTokens } from '../constructThemeTokens'
import type { HightideThemeTokens } from '../hightide'
import { toHightideComponentTokens } from '../to-components'
import { toHightideTheme } from '../to-theme'

export const darkTheme = constructThemeTokens({
  themeName: 'dark',
  primitiveTokens: hightidePrimitiveTokens,
  toSemantic: toHightideSemanticTokens,
  toComponents: toHightideComponentTokens,
  toTheme: toHightideTheme,
}) satisfies HightideThemeTokens
