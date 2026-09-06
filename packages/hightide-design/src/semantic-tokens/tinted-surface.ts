import {
  tokenColorBlend,
  tokenColorOpacity,
  tokenPath
} from '../component-tokens/builders'

export const tintedSurfaceTokens = {
  light: tokenColorBlend(
    tokenPath('theme.color.surface.color'),
    tokenColorOpacity(
      tokenPath('params.tintColor'),
      tokenPath('theme.color.tintConfig.light')
    )
  ),
  normal: tokenColorBlend(
    tokenPath('theme.color.surface.color'),
    tokenColorOpacity(
      tokenPath('params.tintColor'),
      tokenPath('theme.color.tintConfig.normal')
    )
  ),
  strong: tokenColorBlend(
    tokenPath('theme.color.surface.color'),
    tokenColorOpacity(
      tokenPath('params.tintColor'),
      tokenPath('theme.color.tintConfig.strong')
    )
  ),
} as const
