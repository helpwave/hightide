import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type { Color } from '../types/color'
import type {
  SelectMenuStyle,
  SelectOptionState,
  SelectOptionStyle,
  SelectOptionTextStyle,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectState,
  SelectThemeResolvers,
  SelectTriggerStyle,
  SelectTriggerTextStyle
} from '../types/components/select'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

export const toSelectThemeResolvers: ComponentThemeResolver<SelectThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: {
    color?: SelectState['color'],
    isDisabled?: boolean,
    isInvalid?: boolean,
    isHovered?: boolean,
    isFocused?: boolean,
    isPressed?: boolean,
    isReadonly?: boolean,
    isOpen?: boolean,
    hasValue?: boolean,
    isSelected?: boolean,
    isHighlighted?: boolean,
  } = {}) => componentTokens.select({
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
      isPressed: state.isPressed,
      isReadonly: state.isReadonly,
      isOpen: state.isOpen,
      hasValue: state.hasValue,
      isSelected: state.isSelected,
      isHighlighted: state.isHighlighted,
    },
  })

  return {
    trigger: createStyleResolver((state: SelectState): SelectTriggerStyle => (
      toContainerStyle(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isInvalid: state.isInvalid,
        isHovered: state.isHovered,
        isFocused: state.isFocused,
        isPressed: state.isPressed,
        isReadonly: state.isReadonly,
        isOpen: state.isOpen,
        hasValue: state.hasValue,
      }).trigger)
    )),
    triggerText: createStyleResolver((state: SelectState): SelectTriggerTextStyle => (
      toTextStyle(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isInvalid: state.isInvalid,
        isHovered: state.isHovered,
        isFocused: state.isFocused,
        isPressed: state.isPressed,
        isReadonly: state.isReadonly,
        isOpen: state.isOpen,
        hasValue: state.hasValue,
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
    option: createStyleResolver((state: SelectOptionState): SelectOptionStyle => ({
      ...resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).option,
    })),
    optionText: createStyleResolver((state: SelectOptionState): SelectOptionTextStyle => (
      toTextStyle(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).optionText)
    )),
  }
}
