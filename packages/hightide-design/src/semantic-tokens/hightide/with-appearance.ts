import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverParams } from '../../primitive-tokens'
import type { HightideSemanticPathProvider } from './semantic-tokens'

export type Appearance = 'normal' | 'subtle' | 'faded'

export type WithAppearanceParams = AssertAssignable<HightideResolverParams, HightideResolverParams>

const appearanceColor = (
  appearance: Appearance
) => (
  TokenBuilder.colorBlend(
    TokenBuilder.colorValueRef('params.colors.color'),
    TokenBuilder.colorOpacity(
      TokenBuilder.colorValueRef('params.colors.onColor'),
      TokenBuilder.numberRef<HightideSemanticPathProvider>(`theme.config.appearancePercentages.${appearance}`)
    )
  )
)

export const withAppearanceTokens = {
  normal: TokenBuilder.stateful(appearanceColor('normal')),
  subtle: TokenBuilder.stateful(appearanceColor('subtle')),
  faded: TokenBuilder.stateful(appearanceColor('faded')),
} as const
