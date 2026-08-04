import { hightideSelectTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { SelectState as SelectTokenState } from '@helpwave/hightide-design/component-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toTextStyle } from '../adapters/style-adapters'
import type { Color } from '../types/color'
import type {
  SelectMenuStyle,
  SelectOptionState,
  SelectOptionStyle,
  SelectOptionTextStyle,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectState,
  SelectTheme,
  SelectTriggerStyle,
  SelectTriggerTextStyle
} from '../types/components/select'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver
} from '../types/resolver'

const toTriggerTokenState = (state: SelectState): SelectTokenState => ({
  isDisabled: state.isDisabled,
  isInvalid: state.isInvalid,
  isOpen: state.isOpen,
  hasValue: state.hasValue,
})

const toOptionTokenState = (state: SelectOptionState): SelectTokenState => ({
  isDisabled: state.isDisabled,
  isSelected: state.isSelected,
  isHighlighted: state.isHighlighted,
})

export const toSelectTheme = (themeTokens: ThemeTokens): SelectTheme => {
  const resolve = (state: SelectTokenState) => hightideSelectTokenResolver({ themeTokens, state })

  return {
    trigger: createStyleResolver((state: SelectState): SelectTriggerStyle => ({
      ...resolve(toTriggerTokenState(state)).trigger,
    })),
    triggerText: createStyleResolver((state: SelectState): SelectTriggerTextStyle => (
      toTextStyle(resolve(toTriggerTokenState(state)).triggerText)
    )),
    overlay: createSimpleStyleResolver((): SelectOverlayStyle => ({
      ...resolve({}).overlay,
    })),
    menu: createSimpleStyleResolver((): SelectMenuStyle => ({
      ...resolve({}).menu,
    })),
    search: createSimpleStyleResolver((): SelectSearchStyle => ({
      ...resolve({}).search,
    })),
    searchPlaceholderColor: createSimpleValueResolver((): Color => (
      resolve({}).searchPlaceholderColor
    )),
    option: createStyleResolver((state: SelectOptionState): SelectOptionStyle => ({
      ...resolve(toOptionTokenState(state)).option,
    })),
    optionText: createStyleResolver((state: SelectOptionState): SelectOptionTextStyle => (
      toTextStyle(resolve(toOptionTokenState(state)).optionText)
    )),
  }
}
