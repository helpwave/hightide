import { hightideSwitchTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { SwitchComponentResolverProps } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../types/color'
import type {
  SwitchState,
  SwitchTheme
} from '../types/components/switch'
import { createValueResolver } from '../types/resolver'

const toTokenProps = (state: SwitchState): SwitchComponentResolverProps => ({
  state: {
    isActive: state.isActive,
    isDisabled: state.isDisabled,
    isInvalid: state.isInvalid,
  },
})

export const toSwitchTheme = (themeTokens: ThemeTokens): SwitchTheme => {
  const resolve = (state: SwitchState) => hightideSwitchTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...toTokenProps(state),
  })

  return {
    trackColor: createValueResolver((state: SwitchState): Color => resolve(state).trackColor),
    borderColor: createValueResolver((state: SwitchState): Color => resolve(state).borderColor),
    thumbColor: createValueResolver((state: SwitchState): Color => resolve(state).thumbColor),
  }
}
