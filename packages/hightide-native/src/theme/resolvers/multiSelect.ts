import { hightideMultiSelectTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { MultiSelectState as MultiSelectTokenState } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toTextStyle } from '../adapters/style-adapters'
import type { Color } from '../types/color'
import type {
  MultiSelectCheckboxIconStyle,
  MultiSelectCheckboxStyle,
  MultiSelectOptionState,
  MultiSelectOptionStyle,
  MultiSelectOptionTextStyle,
  MultiSelectState,
  MultiSelectTheme,
  MultiSelectTriggerStyle
} from '../types/components/multiSelect'
import type {
  SelectMenuStyle,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectTriggerTextStyle
} from '../types/components/select'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

const toTriggerTokenState = (state: MultiSelectState): MultiSelectTokenState => ({
  isDisabled: state.isDisabled,
  isInvalid: state.isInvalid,
  isOpen: state.isOpen,
  hasSelections: state.hasSelections,
})

const toOptionTokenState = (state: MultiSelectOptionState): MultiSelectTokenState => ({
  isDisabled: state.isDisabled,
  isSelected: state.isSelected,
  isHighlighted: state.isHighlighted,
})

export const toMultiSelectTheme = (themeTokens: ThemeTokens): MultiSelectTheme => {
  const resolve = (state: MultiSelectTokenState) => hightideMultiSelectTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    state,
  })

  return {
    trigger: createStyleResolver((state: MultiSelectState): MultiSelectTriggerStyle => ({
      ...resolve(toTriggerTokenState(state)).trigger,
    })),
    triggerText: createSimpleStyleResolver((): SelectTriggerTextStyle => (
      toTextStyle(resolve({}).triggerText)
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
    option: createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionStyle => ({
      ...resolve(toOptionTokenState(state)).option,
    })),
    optionText: createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionTextStyle => (
      toTextStyle(resolve(toOptionTokenState(state)).optionText)
    )),
    checkbox: createStyleResolver((state: MultiSelectOptionState): MultiSelectCheckboxStyle => ({
      ...resolve(toOptionTokenState(state)).checkbox,
    })),
    checkboxIcon: createValueResolver((state: MultiSelectOptionState): MultiSelectCheckboxIconStyle => {
      const { checkboxIcon } = resolve(toOptionTokenState(state))

      return {
        color: checkboxIcon.color,
        visible: checkboxIcon.isVisible,
      }
    }),
  }
}
