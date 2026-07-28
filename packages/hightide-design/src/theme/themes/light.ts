import { hightidePrimitiveTokens } from '../../primitive/primitive-tokens'
import { toHightideSemanticTokens } from '../../semantic/to-semantic'
import { constructThemeTokens } from '../constructThemeTokens'
import type { HightideThemeTokens } from '../hightide'
import { toHightideComponentTokens } from '../to-components'
import { toHightideTheme } from '../to-theme'

export const lightTheme = constructThemeTokens({
  themeName: 'light',
  primitiveTokens: hightidePrimitiveTokens,
  toSemantic: toHightideSemanticTokens,
  toComponents: toHightideComponentTokens,
  toTheme: toHightideTheme,
}) satisfies HightideThemeTokens
