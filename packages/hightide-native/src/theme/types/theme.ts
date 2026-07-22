import type {
  HightideColors,
  HightideSemanticColors
} from '@/src/theme/types/color'
import type { HightideComponentThemes } from '@/src/theme/types/components/hightide'
import type { HightideDecoration } from '@/src/theme/types/decoration'
import type { HightideLayout } from '@/src/theme/types/layout'
import type { HightideTypography } from '@/src/theme/types/typography'

export type Theme = {
  colors: Record<string, unknown> & HightideColors,
  semantic: Record<string, unknown> & HightideSemanticColors,
  components: Record<string, unknown>  & HightideComponentThemes,
  typography: Record<string, unknown> & HightideTypography,
  layout: Record<string, unknown> & HightideLayout,
  decoration: Record<string, unknown> & HightideDecoration,
}
