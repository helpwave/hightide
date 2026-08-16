import {
  hightideColor,
  type HightideColorPrimitiveTokens
} from './color'
import {
  hightideShadow,
  type HightideShadowPrimitiveTokens
} from './shadow'
import {
  hightideTypography,
  type HightideTypographyPrimitiveTokens
} from './typography'

export type HightidePrimitiveTokens = {
  color: HightideColorPrimitiveTokens,
  typography: HightideTypographyPrimitiveTokens,
  shadow: HightideShadowPrimitiveTokens,
}

export const hightidePrimitiveTokens = {
  color: hightideColor,
  typography: hightideTypography,
  shadow: hightideShadow,
} as const satisfies HightidePrimitiveTokens
