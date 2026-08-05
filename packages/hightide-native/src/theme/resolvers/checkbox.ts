import { hightideCheckboxTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { CheckboxState as CheckboxTokenState } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type {
  CheckboxIconStyle,
  CheckboxState,
  CheckboxStyle,
  CheckboxTheme
} from '../types/components/checkbox'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

const toTokenState = (state: CheckboxState): CheckboxTokenState => ({
  size: state.size,
  isDisabled: state.isDisabled,
  isChecked: state.isChecked,
  isIndeterminate: state.isIndeterminate,
  isInvalid: state.isInvalid,
  isRounded: state.isRounded,
  alwaysShowCheckIcon: state.alwaysShowCheckIcon,
})

export const toCheckboxTheme = (themeTokens: ThemeTokens): CheckboxTheme => {
  const resolve = (state: CheckboxState) => hightideCheckboxTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    state: toTokenState(state),
  })

  return {
    checkbox: createStyleResolver((state: CheckboxState): CheckboxStyle => ({
      ...resolve(state).box,
    })),
    icon: createValueResolver((state: CheckboxState): CheckboxIconStyle => {
      const { icon } = resolve(state)

      return {
        color: icon.color,
        size: icon.size,
        visible: icon.isVisible,
      }
    }),
  }
}
