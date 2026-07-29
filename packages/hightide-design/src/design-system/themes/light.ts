import { hightidePrimitiveTokens } from '../../primitive/primitive-tokens'
import { toHightideComponentTokens } from '../../components/to-components'
import { toHightideSemanticTokens } from '../../semantic/to-semantic'
import { toLightThemeTokens } from '../../theme/to-light-theme'
import { constructThemeTokens } from '../constructThemeTokens'
import type { DesignSystemTokens } from '../design'

export const lightTheme = constructThemeTokens({
  primitiveTokens: hightidePrimitiveTokens,
  toThemeTokens: toLightThemeTokens,
  toSemantic: toHightideSemanticTokens,
  toComponents: toHightideComponentTokens,
}) satisfies DesignSystemTokens
