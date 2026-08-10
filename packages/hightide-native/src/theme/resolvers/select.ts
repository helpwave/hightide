import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type { Color } from '../types/color'
import type {
  SelectIconStyle,
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
  createValueResolver,
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
    isFocusVisible?: boolean,
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
      isFocusVisible: state.isFocusVisible,
      isPressed: state.isPressed,
      isReadonly: state.isReadonly,
      isOpen: state.isOpen,
      hasValue: state.hasValue,
      isSelected: state.isSelected,
      isHighlighted: state.isHighlighted,
    },
  })

  const toTriggerState = (state: SelectState) => ({
    color: state.color,
    isDisabled: state.isDisabled,
    isInvalid: state.isInvalid,
    isHovered: state.isHovered,
    isFocused: state.isFocused,
    isFocusVisible: state.isFocusVisible,
    isPressed: state.isPressed,
    isReadonly: state.isReadonly,
    isOpen: state.isOpen,
    hasValue: state.hasValue,
  })

  return {
    trigger: createStyleResolver((state: SelectState): SelectTriggerStyle => (
      toContainerStyle(resolve(toTriggerState(state)).trigger)
    )),
    triggerText: createStyleResolver((state: SelectState): SelectTriggerTextStyle => (
      toTextStyle(resolve(toTriggerState(state)).triggerText)
    )),
    icon: createValueResolver((state: SelectState): SelectIconStyle => {
      const { icon } = resolve(toTriggerState(state))

      return {
        size: icon.size,
        strokeWidth: icon.strokeWidth,
        color: icon.color,
      }
    }),
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
