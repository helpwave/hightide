import {
  hightideBorder,
  type HightideBorderPrimitiveTokens
} from './border'
import {
  hightideColor,
  type HightideColorPrimitiveTokens
} from './color'
import {
  hightideRadius,
  type HightideRadiusPrimitiveTokens
} from './radius'
import {
  hightideShadow,
  type HightideShadowPrimitiveTokens
} from './shadow'
import {
  hightideSizes,
  type HightideSizePrimitiveTokens
} from './size'
import {
  hightideSpacing,
  type HightideSpacingPrimitiveTokens
} from './spacing'
import {
  hightideTypography,
  type HightideTypographyPrimitiveTokens
} from './typography'

export type HightidePrimitiveTokens = {
  color: HightideColorPrimitiveTokens,
  spacing: HightideSpacingPrimitiveTokens,
  sizes: HightideSizePrimitiveTokens,
  typography: HightideTypographyPrimitiveTokens,
  radius: HightideRadiusPrimitiveTokens,
  border: HightideBorderPrimitiveTokens,
  shadow: HightideShadowPrimitiveTokens,
}

export const hightidePrimitiveTokens = {
  color: hightideColor,
  spacing: hightideSpacing,
  sizes: hightideSizes,
  typography: hightideTypography,
  radius: hightideRadius,
  border: hightideBorder,
  shadow: hightideShadow,
} as const satisfies HightidePrimitiveTokens
