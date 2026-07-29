import { hightidePrimitiveTokens } from '../../primitive/primitive-tokens'
import { toHightideComponentTokens } from '../../components/to-components'
import { toHightideSemanticTokens } from '../../semantic/to-semantic'
import { toDarkThemeTokens } from '../../theme/to-dark-theme'
import { constructThemeTokens } from '../constructThemeTokens'
import type { DesignSystemTokens } from '../design'

export const darkTheme = constructThemeTokens({
  primitiveTokens: hightidePrimitiveTokens,
  toThemeTokens: toDarkThemeTokens,
  toSemantic: toHightideSemanticTokens,
  toComponents: toHightideComponentTokens,
}) satisfies DesignSystemTokens
