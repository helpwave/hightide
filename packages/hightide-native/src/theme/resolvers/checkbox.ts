import { hightideCheckboxTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { CheckboxComponentResolverProps } from '@helpwave/hightide-design/component-token-resolvers'
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

const toTokenProps = (state: CheckboxState): CheckboxComponentResolverProps => ({
  config: {
    alwaysShowCheckIcon: state.alwaysShowCheckIcon,
  },
  overrides: {
    size: state.size,
    isRounded: state.isRounded,
  },
  state: {
    isDisabled: state.isDisabled,
    isChecked: state.isChecked,
    isIndeterminate: state.isIndeterminate,
    isInvalid: state.isInvalid,
  },
})

export const toCheckboxTheme = (themeTokens: ThemeTokens): CheckboxTheme => {
  const resolve = (state: CheckboxState) => hightideCheckboxTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...toTokenProps(state),
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
