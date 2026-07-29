import {
  hightideBorder,
  type BorderPrimitiveTokens
} from './border'
import {
  hightideColor,
  type ColorPrimitiveTokens
} from './color'
import {
  hightideMotion,
  type MotionPrimitiveTokens
} from './motion'
import {
  hightideRadius,
  type RadiusPrimitiveTokens
} from './radius'
import {
  hightideShadow,
  type ShadowPrimitiveTokens
} from './shadow'
import {
  hightideSizes,
  type SizePrimitiveTokens
} from './size'
import {
  hightideSpacing,
  type SpacingPrimitiveTokens
} from './spacing'
import {
  hightideTypography,
  type TypographyPrimitiveTokens
} from './typography'

export type PrimitiveTokens = {
  color: ColorPrimitiveTokens,
  spacing: SpacingPrimitiveTokens,
  sizes: SizePrimitiveTokens,
  typography: TypographyPrimitiveTokens,
  radius: RadiusPrimitiveTokens,
  border: BorderPrimitiveTokens,
  shadow: ShadowPrimitiveTokens,
  motion: MotionPrimitiveTokens,
}

export const hightidePrimitiveTokens = {
  color: hightideColor,
  spacing: hightideSpacing,
  sizes: hightideSizes,
  typography: hightideTypography,
  radius: hightideRadius,
  border: hightideBorder,
  shadow: hightideShadow,
  motion: hightideMotion,
} as const satisfies PrimitiveTokens
