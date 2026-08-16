import type { ThemeColorTokens } from '@helpwave/hightide-design/theme-tokens'

import type { HightideComponentThemes } from './components/hightide'
import type { HightideIcongraphy } from './icongraphy'
import type {
  HightideBorder,
  HightideBorderRadius,
  HightideElements,
  HightideShadow,
  HightideSpacing
} from './layout'
import type { HightideThemeSemantics } from './semantics'
import type { HightideTypography } from './typography'

export type Theme = {
  colors: Record<string, unknown>,
  semantics: Record<string, unknown>,
  components: Record<string, unknown>,
  typography: Record<string, unknown>,
  icongraphy: Record<string, unknown>,
  spacing: Record<string, unknown>,
  elements: Record<string, unknown>,
  borderRadius: Record<string, unknown>,
  border: Record<string, unknown>,
  shadow: Record<string, unknown>,
}

export type HightideTheme = Theme & {
  colors: ThemeColorTokens & Theme['colors'],
  semantics: HightideThemeSemantics & Theme['semantics'],
  components: HightideComponentThemes & Theme['components'],
  typography: HightideTypography & Theme['typography'],
  icongraphy: HightideIcongraphy & Theme['icongraphy'],
  spacing: HightideSpacing & Theme['spacing'],
  elements: HightideElements & Theme['elements'],
  borderRadius: HightideBorderRadius & Theme['borderRadius'],
  border: HightideBorder & Theme['border'],
  shadow: HightideShadow & Theme['shadow'],
}
