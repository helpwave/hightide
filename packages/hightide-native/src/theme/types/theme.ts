import type { ColorSchemes, SemanticColorTokens } from '@helpwave/hightide-design/semantic'

import type { HightideComponentThemes } from './components/hightide'
import type {
  HightideBorder,
  HightideElements,
  HightideRadius,
  HightideShadow,
  HightideSpacing
} from './layout'
import type { HightideTypography } from './typography'

export type Theme = {
  colors: Record<string, unknown>,
  colorSchemes: Record<string, unknown>,
  components: Record<string, unknown>,
  typography: Record<string, unknown>,
  spacing: Record<string, unknown>,
  elements: Record<string, unknown>,
  radius: Record<string, unknown>,
  border: Record<string, unknown>,
  shadow: Record<string, unknown>,
}

export type HightideTheme = Theme & {
  colors: SemanticColorTokens & Theme['colors'],
  colorSchemes: ColorSchemes & Theme['colorSchemes'],
  components: HightideComponentThemes & Theme['components'],
  typography: HightideTypography & Theme['typography'],
  spacing: HightideSpacing & Theme['spacing'],
  elements: HightideElements & Theme['elements'],
  radius: HightideRadius & Theme['radius'],
  border: HightideBorder & Theme['border'],
  shadow: HightideShadow & Theme['shadow'],
}
