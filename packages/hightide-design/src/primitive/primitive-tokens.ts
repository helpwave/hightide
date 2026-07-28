import {
  hightideBorder,
  type BorderPrimitiveTokens
} from './border'
import {
  hightideBreakpoint,
  type BreakpointPrimitiveTokens
} from './breakpoint'
import {
  hightideColor,
  type ColorPrimitiveTokens
} from './color'
import {
  hightideElements,
  type ElementPrimitiveTokens
} from './elements'
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
  elements: ElementPrimitiveTokens,
  typography: TypographyPrimitiveTokens,
  radius: RadiusPrimitiveTokens,
  border: BorderPrimitiveTokens,
  shadow: ShadowPrimitiveTokens,
  motion: MotionPrimitiveTokens,
  breakpoint: BreakpointPrimitiveTokens,
}

export const hightidePrimitiveTokens = {
  color: hightideColor,
  spacing: hightideSpacing,
  elements: hightideElements,
  typography: hightideTypography,
  radius: hightideRadius,
  border: hightideBorder,
  shadow: hightideShadow,
  motion: hightideMotion,
  breakpoint: hightideBreakpoint,
} as const satisfies PrimitiveTokens
