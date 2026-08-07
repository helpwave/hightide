import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
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
    color?: MultiSelectState['color'],
    isDisabled?: boolean,
    isInvalid?: boolean,
    isHovered?: boolean,
    isFocused?: boolean,
    isFocusVisible?: boolean,
    isPressed?: boolean,
    isReadonly?: boolean,
    isOpen?: boolean,
    hasSelections?: boolean,
    isSelected?: boolean,
    isHighlighted?: boolean,
  } = {}) => componentTokens.multiSelect({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      color: state.color,
    },
    state: {
      isDisabled: state.isDisabled,
      isInvalid: state.isInvalid,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isFocusVisible: state.isFocusVisible,
      isPressed: state.isPressed,
      isReadonly: state.isReadonly,
      isOpen: state.isOpen,
      hasSelections: state.hasSelections,
      isSelected: state.isSelected,
      isHighlighted: state.isHighlighted,
    },
  })

  return {
    trigger: createStyleResolver((state: MultiSelectState): MultiSelectTriggerStyle => (
      toContainerStyle(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isInvalid: state.isInvalid,
        isHovered: state.isHovered,
        isFocused: state.isFocused,
        isFocusVisible: state.isFocusVisible,
        isPressed: state.isPressed,
        isReadonly: state.isReadonly,
        isOpen: state.isOpen,
        hasSelections: state.hasSelections,
      }).trigger)
    )),
    triggerText: createStyleResolver((state: MultiSelectState): SelectTriggerTextStyle => (
      toTextStyle(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isInvalid: state.isInvalid,
        isHovered: state.isHovered,
        isFocused: state.isFocused,
        isFocusVisible: state.isFocusVisible,
        isPressed: state.isPressed,
        isReadonly: state.isReadonly,
        isOpen: state.isOpen,
        hasSelections: state.hasSelections,
      }).triggerText)
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
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).option,
    })),
    optionText: createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionTextStyle => (
      toTextStyle(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).optionText)
    )),
    checkbox: createStyleResolver((state: MultiSelectOptionState): MultiSelectCheckboxStyle => ({
      ...resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).checkbox,
    })),
    checkboxIcon: createValueResolver((state: MultiSelectOptionState): MultiSelectCheckboxIconStyle => {
      const { checkboxIcon } = resolve({
        color: state.color,
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
