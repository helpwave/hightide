import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverParams } from '../../primitive-tokens'
import type { HightideTokenPathProvider } from '../../component-tokens'

export type TintedSurfaceParams = AssertAssignable<{
  colors: {
    tintColor: ColorValueToken,
  },
}, HightideResolverParams>

export const tintedSurfaceTokens = {
  light: TokenBuilder.stateful(
    TokenBuilder.colorBlend(
      TokenBuilder.colorValueRef('theme.color.surface.color'),
      TokenBuilder.colorOpacity(
        TokenBuilder.colorValueRef<HightideTokenPathProvider<TintedSurfaceParams>>('params.colors.tintColor'),
        TokenBuilder.numberRef('theme.color.tintConfig.light')
      )
    )
  ),
  normal: TokenBuilder.stateful(
    TokenBuilder.colorBlend(
      TokenBuilder.colorValueRef('theme.color.surface.color'),
      TokenBuilder.colorOpacity(
        TokenBuilder.colorValueRef<HightideTokenPathProvider<TintedSurfaceParams>>('params.colors.tintColor'),
        TokenBuilder.numberRef('theme.color.tintConfig.normal')
      )
    )
  ),
  strong: TokenBuilder.stateful(
    TokenBuilder.colorBlend(
      TokenBuilder.colorValueRef('theme.color.surface.color'),
      TokenBuilder.colorOpacity(
        TokenBuilder.colorValueRef<HightideTokenPathProvider<TintedSurfaceParams>>('params.colors.tintColor'),
        TokenBuilder.numberRef('theme.color.tintConfig.strong')
      )
    )
  ),
} as const
