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
  HightideElements,
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
  semantics: Record<string, unknown>,
  components: Record<string, unknown>,
  typography: Record<string, unknown>,
  icongraphy: Record<string, unknown>,
  spacing: Record<string, unknown>,
  size: Record<string, unknown>,
  padding: Record<string, unknown>,
  elements: Record<string, unknown>,
  borderRadius: Record<string, unknown>,
  borderWidth: Record<string, unknown>,
  elevation: Record<string, unknown>,
  motion: Record<string, unknown>,
  focusOutline: Record<string, unknown>,
  fontSizing: Record<string, unknown>,
  fontWeights: Record<string, unknown>,
  fontFamilies: Record<string, unknown>,
  config: Record<string, unknown>,
  shadow: Record<string, unknown>,
}

export type HightideTheme = Theme & {
  colors: ThemeColorTokens & Theme['colors'],
  semantics: HightideThemeSemantics & Theme['semantics'],
  components: HightideComponentThemes & Theme['components'],
  typography: HightideTypography & Theme['typography'],
  icongraphy: HightideIcongraphy & Theme['icongraphy'],
  spacing: HightideSpacing & Theme['spacing'],
  size: HightideSize & Theme['size'],
  padding: HightidePadding & Theme['padding'],
  elements: HightideElements & Theme['elements'],
  borderRadius: HightideBorderRadius & Theme['borderRadius'],
  borderWidth: HightideBorderWidth & Theme['borderWidth'],
  elevation: HightideElevation & Theme['elevation'],
  motion: HightideMotion & Theme['motion'],
  focusOutline: OutlineToken & Theme['focusOutline'],
  fontSizing: HightideFontSizing & Theme['fontSizing'],
  fontWeights: HightideFontWeights & Theme['fontWeights'],
  fontFamilies: HightideFontFamilies & Theme['fontFamilies'],
  config: ThemeConfigTokens & Theme['config'],
  shadow: HightideShadow & Theme['shadow'],
}
