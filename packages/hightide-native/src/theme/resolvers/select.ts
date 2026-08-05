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
    isDisabled?: boolean,
    isInvalid?: boolean,
    isOpen?: boolean,
    hasValue?: boolean,
    isSelected?: boolean,
    isHighlighted?: boolean,
  } = {}) => componentTokens.select({
    themeTokens,
    semanticResolvers: semanticTokens,
    state,
  })

  return {
    trigger: createStyleResolver((state: SelectState): SelectTriggerStyle => ({
      ...resolve({
        isDisabled: state.isDisabled,
        isInvalid: state.isInvalid,
        isOpen: state.isOpen,
        hasValue: state.hasValue,
      }).trigger,
    })),
    triggerText: createStyleResolver((state: SelectState): SelectTriggerTextStyle => (
      toTextStyle(resolve({
        isDisabled: state.isDisabled,
        isInvalid: state.isInvalid,
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
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).option,
    })),
    optionText: createStyleResolver((state: SelectOptionState): SelectOptionTextStyle => (
      toTextStyle(resolve({
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).optionText)
    )),
  }
}
