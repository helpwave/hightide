import { toTextStyle } from '../adapters/style-adapters'
import type { Color } from '../types/color'
import type {
  MultiSelectCheckboxIconStyle,
  MultiSelectCheckboxStyle,
  MultiSelectOptionState,
  MultiSelectOptionStyle,
  MultiSelectOptionTextStyle,
  MultiSelectState,
  MultiSelectThemeResolvers,
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
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

export const toMultiSelectThemeResolvers: ComponentThemeResolver<MultiSelectThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: {
    isDisabled?: boolean,
    isInvalid?: boolean,
    isOpen?: boolean,
    hasSelections?: boolean,
    isSelected?: boolean,
    isHighlighted?: boolean,
  } = {}) => componentTokens.multiSelect({
    themeTokens,
    semanticResolvers: semanticTokens,
    state,
  })

  return {
    trigger: createStyleResolver((state: MultiSelectState): MultiSelectTriggerStyle => ({
      ...resolve({
        isDisabled: state.isDisabled,
        isInvalid: state.isInvalid,
        isOpen: state.isOpen,
        hasSelections: state.hasSelections,
      }).trigger,
    })),
    triggerText: createSimpleStyleResolver((): SelectTriggerTextStyle => (
      toTextStyle(resolve().triggerText)
    )),
    overlay: createSimpleStyleResolver((): SelectOverlayStyle => ({
      ...resolve().overlay,
    })),
    menu: createSimpleStyleResolver((): SelectMenuStyle => ({
      ...resolve().menu,
    })),
    search: createSimpleStyleResolver((): SelectSearchStyle => ({
      ...resolve().search,
    })),
    searchPlaceholderColor: createSimpleValueResolver((): Color => (
      resolve().searchPlaceholderColor
    )),
    option: createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionStyle => ({
      ...resolve({
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).option,
    })),
    optionText: createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionTextStyle => (
      toTextStyle(resolve({
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).optionText)
    )),
    checkbox: createStyleResolver((state: MultiSelectOptionState): MultiSelectCheckboxStyle => ({
      ...resolve({
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).checkbox,
    })),
    checkboxIcon: createValueResolver((state: MultiSelectOptionState): MultiSelectCheckboxIconStyle => {
      const { checkboxIcon } = resolve({
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      })

      return {
        color: checkboxIcon.color,
        visible: checkboxIcon.isVisible,
      }
    }),
  }
}
