import type {
  HightideColors,
  HightideSemanticColors
} from './color'
import type { HightideComponentThemes } from './components/hightide'
import type { HightideDecoration } from './decoration'
import type { HightideLayout } from './layout'
import type { HightideTypography } from './typography'

export type Theme = {
  colors: Record<string, unknown> & HightideColors,
  semantic: Record<string, unknown> & HightideSemanticColors,
  components: Record<string, unknown>  & HightideComponentThemes,
  typography: Record<string, unknown> & HightideTypography,
  layout: Record<string, unknown> & HightideLayout,
  decoration: Record<string, unknown> & HightideDecoration,
}
