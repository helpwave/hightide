import type { ColorToken } from '../primitive-tokens/color'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { TypographyStyleToken } from '../theme-tokens/typography-style-token'

export type PressableButtonTokenParams = {
  layout: {
    size: number,
    inset: number,
    borderWidth: number,
    borderRadius: number,
    horizontalContentPadding: number,
  },
  tint: ColorToken,
  textStyle: TypographyStyleToken,
  iconSize: number,
  iconStrokeWidth: number,
  gap: number,
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
