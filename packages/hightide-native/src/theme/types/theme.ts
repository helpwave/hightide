import type {
  HightideColors,
  HightideSemanticColors
} from './color'
import type { HightideComponentThemes } from './components/hightide'
import type { HightideDecoration } from './decoration'
import type { HightideLayout } from './layout'
import type { HightideTypography } from './typography'

export type Theme = {
  colors: Record<string, unknown>,
  semantic: Record<string, unknown>,
  components: Record<string, unknown>,
  typography: Record<string, unknown>,
  layout: Record<string, unknown>,
  decoration: Record<string, unknown>,
}

export type HightideTheme = Theme & {
  colors: HightideColors & Theme['colors'],
  semantic: HightideSemanticColors & Theme['semantic'],
  components: HightideComponentThemes & Theme['components'],
  typography: HightideTypography & Theme['typography'],
  layout: HightideLayout & Theme['layout'],
  decoration: HightideDecoration & Theme['decoration'],
}
