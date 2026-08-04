import { hightideSwitchTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { SwitchState as SwitchTokenState } from '@helpwave/hightide-design/component-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../types/color'
import type {
  SwitchState,
  SwitchTheme
} from '../types/components/switch'
import { createValueResolver } from '../types/resolver'

const toTokenState = (state: SwitchState): SwitchTokenState => ({
  isActive: state.isActive,
  isDisabled: state.isDisabled,
  isInvalid: state.isInvalid,
})

export const toSwitchTheme = (themeTokens: ThemeTokens): SwitchTheme => ({
  trackColor: createValueResolver((state: SwitchState): Color => (
    hightideSwitchTokenResolver({ themeTokens, state: toTokenState(state) }).trackColor
  )),
  borderColor: createValueResolver((state: SwitchState): Color => (
    hightideSwitchTokenResolver({ themeTokens, state: toTokenState(state) }).borderColor
  )),
  thumbColor: createValueResolver((state: SwitchState): Color => (
    hightideSwitchTokenResolver({ themeTokens, state: toTokenState(state) }).thumbColor
  )),
})
