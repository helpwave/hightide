import type { HexColorToken } from '../primitive-tokens/color'
import {
  tokenColorBlend,
  tokenColorOpacity,
  createTokenVariable
} from '../component-tokens/builders'

export type TintedSurfaceParams = {
  tintColor: HexColorToken,
}

const tokenVariable = createTokenVariable<TintedSurfaceParams>()

export const tintedSurfaceTokens = {
  light: tokenColorBlend(
    tokenVariable('theme.color.surface.color'),
    tokenColorOpacity(
      tokenVariable('params.tintColor'),
      tokenVariable('theme.color.tintConfig.light')
    )
  ),
  normal: tokenColorBlend(
    tokenVariable('theme.color.surface.color'),
    tokenColorOpacity(
      tokenVariable('params.tintColor'),
      tokenVariable('theme.color.tintConfig.normal')
    )
  ),
  strong: tokenColorBlend(
    tokenVariable('theme.color.surface.color'),
    tokenColorOpacity(
      tokenVariable('params.tintColor'),
      tokenVariable('theme.color.tintConfig.strong')
    )
  ),
} as const
