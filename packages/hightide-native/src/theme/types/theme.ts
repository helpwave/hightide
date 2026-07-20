import type {
  ColoringTokensDefinitions,
  DesignColorPalettes,
  SemanticColors
} from '@helpwave/hightide-design'
import type { ComponentThemes } from './components'

export type DesignTheme = {
  palettes: DesignColorPalettes,
  semantic: SemanticColors,
  coloring: ColoringTokensDefinitions,
  components: ComponentThemes,
}
