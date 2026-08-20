import type {
  OutlineToken,
  ThemeColorTokens,
  ThemeConfigTokens
} from '@helpwave/hightide-design/theme-tokens'

import type { HightideComponentThemes } from './components/hightide'
import type { HightideIcongraphy } from './icongraphy'
import type {
  HightideBorderRadius,
  HightideBorderWidth,
  HightideElevation,
  HightideMotion,
  HightidePadding,
  HightideShadow,
  HightideSize,
  HightideSpacing
} from './layout'
import type { HightideThemeSemantics } from './semantics'
import type {
  HightideFontFamilies,
  HightideFontSizing,
  HightideFontWeights,
  HightideTypography
} from './typography'

export type Theme = {
  colors: Record<string, unknown>,
  fontFamilies: Record<string, unknown>,
  fontWeights: Record<string, unknown>,
  fontSizing: Record<string, unknown>,
  typography: Record<string, unknown>,
  icongraphy: Record<string, unknown>,
  size: Record<string, unknown>,
  spacing: Record<string, unknown>,
  padding: Record<string, unknown>,
  borderRadius: Record<string, unknown>,
  borderWidth: Record<string, unknown>,
  elevation: Record<string, unknown>,
  shadow: Record<string, unknown>,
  motion: Record<string, unknown>,
  focusOutline: Record<string, unknown>,
  config: Record<string, unknown>,
  semantics: Record<string, unknown>,
  components: Record<string, unknown>,
}

export type HightideTheme = Theme & {
  colors: ThemeColorTokens & Theme['colors'],
  fontFamilies: HightideFontFamilies & Theme['fontFamilies'],
  fontWeights: HightideFontWeights & Theme['fontWeights'],
  fontSizing: HightideFontSizing & Theme['fontSizing'],
  typography: HightideTypography & Theme['typography'],
  icongraphy: HightideIcongraphy & Theme['icongraphy'],
  size: HightideSize & Theme['size'],
  spacing: HightideSpacing & Theme['spacing'],
  padding: HightidePadding & Theme['padding'],
  borderRadius: HightideBorderRadius & Theme['borderRadius'],
  borderWidth: HightideBorderWidth & Theme['borderWidth'],
  elevation: HightideElevation & Theme['elevation'],
  shadow: HightideShadow & Theme['shadow'],
  motion: HightideMotion & Theme['motion'],
  focusOutline: OutlineToken & Theme['focusOutline'],
  config: ThemeConfigTokens & Theme['config'],
  semantics: HightideThemeSemantics & Theme['semantics'],
  components: HightideComponentThemes & Theme['components'],
}
