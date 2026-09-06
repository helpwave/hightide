import {
  tokenColorBlend,
  tokenColorOpacity,
  tokenPath
} from '../component-tokens/builders'

export type Appearance = 'normal' | 'subtle' | 'faded'

const appearanceColor = (
  appearance: Appearance
) => (
  tokenColorBlend(
    tokenPath('params.colorPair.color'),
    tokenColorOpacity(
      tokenPath('params.colorPair.onColor'),
      tokenPath(`theme.config.appearancePercentages.${appearance}`)
    )
  )
)

export const withAppearanceTokens = {
  normal: appearanceColor('normal'),
  subtle: appearanceColor('subtle'),
  faded: appearanceColor('faded'),
} as const
