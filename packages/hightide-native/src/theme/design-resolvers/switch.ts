import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import {
  switchTokens,
  toPressableState,
  type SwitchTokenResolver,
  type SwitchTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'
import {
  resolvePressableStateLayerTint,
  resolveWithAppearance
} from './semantic'

type SwitchParams = {
  tint: ColorToken,
}

export const switchTokenResolver: SwitchTokenResolver = ({
  themeTokens,
  state,
}) => {
  const thumbColor = state.has('active')
    ? themeTokens.color.primary.onColor
    : resolveWithAppearance({
      themeTokens,
      colorPair: themeTokens.color.surface,
      appearance: 'subtle',
    })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: toPressableState(state),
    color: thumbColor,
  })

  return resolveTokenConfig<SwitchTokens>(
    switchTokens,
    state,
    {
      theme: themeTokens,
      params: {
        tint,
      } satisfies SwitchParams,
    }
  )
}
