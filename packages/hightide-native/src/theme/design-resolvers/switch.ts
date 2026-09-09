import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import {
  switchTokens,
  toPressableState,
  type SwitchTokenResolver,
  type SwitchTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '../static-resolve/resolve'
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

  return resolveConfigNode<SwitchTokens>(
    switchTokens,
    {
      theme: themeTokens,
      params: {
        tint,
      } satisfies SwitchParams,
      state: state,
    }
  )
}
