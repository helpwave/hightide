import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  tokenColorBlend,
  tokenColorOpacity,
  createTokenVariable
} from '../component-tokens/builders'

export type Appearance = 'normal' | 'subtle' | 'faded'

export type WithAppearanceParams = {
  colorPair: ColorPairToken,
}

const tokenVariable = createTokenVariable<WithAppearanceParams>()

const appearanceColor = (
  appearance: Appearance
) => (
  tokenColorBlend(
    tokenVariable('params.colorPair.color'),
    tokenColorOpacity(
      tokenVariable('params.colorPair.onColor'),
      tokenVariable(`theme.config.appearancePercentages.${appearance}`)
    )
  )
)

export const withAppearanceTokens = {
  normal: appearanceColor('normal'),
  subtle: appearanceColor('subtle'),
  faded: appearanceColor('faded'),
} as const
