import type {
  ColoringDefintionTokens,
  DesignColorPalettes,
  SemanticColors,
  TypographyScaleTokens
} from '@helpwave/hightide-design'
import type { ComponentThemes } from './components'

export type DesignTheme<T extends object = object> = {
  palettes: DesignColorPalettes,
  semantic: SemanticColors,
  coloring: ColoringDefintionTokens,
  typography: TypographyScaleTokens,
  components: ComponentThemes,
} & T
