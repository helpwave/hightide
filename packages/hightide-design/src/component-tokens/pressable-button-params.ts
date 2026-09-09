import type { ColorToken } from '../primitive-tokens/color'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'

export type PressableButtonTokenParams = {
  color?: ColorToken,
  colorPair?: ColorPairToken,
  coloring?: {
    color?: ColorToken,
    onColor?: ColorToken,
    accent?: ColorToken,
    foreground?: ColorToken,
    background?: ColorToken,
    border?: ColorToken,
    outline?: ColorToken,
  },
  coloringVariant?: {
    color?: ColorToken,
    onColor?: ColorToken,
    accent?: ColorToken,
  },
  coloringStyle?: {
    foreground?: ColorToken,
    background?: ColorToken,
    accent?: ColorToken,
  },
  disabledColoring?: {
    foreground?: ColorToken,
    background?: ColorToken,
    accent?: ColorToken,
  },
}
