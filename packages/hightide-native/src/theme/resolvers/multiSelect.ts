import type {
  MultiSelectState as DesignMultiSelectState,
  MultiSelectStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import { toContainerStyle, toContainerStyleWithStateLayer, toTextStyle } from '../adapters/style-adapters'
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
  SelectEmptyTextStyle,
  SelectHeaderStyle,
  SelectMenuState,
  SelectMenuStyle,
  SelectOverlayStyle,
  SelectTriggerTextStyle
} from '../types/components/select'
import {
  createSimpleStyleResolver,
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

type MultiSelectResolveState = {
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
  hasSearch?: boolean,
}

const toDesignMultiSelectState = (
  state: MultiSelectResolveState = {}
): DesignMultiSelectState => {
  const active = new Set<MultiSelectStateValue>()

  if (state.isDisabled) {
    active.add('disabled')
  }
  if (state.isFocused) {
    active.add('focused')
  }
  if (state.isFocusVisible) {
    active.add('focusVisible')
  }
  if (state.isHovered) {
    active.add('hovered')
  }
  if (state.isPressed) {
    active.add('pressed')
  }
  if (state.isReadonly) {
    active.add('readonly')
  }
  if (state.isInvalid) {
    active.add('invalid')
  }
  if (state.isOpen) {
    active.add('open')
  }
  if (state.hasSelections) {
    active.add('hasSelections')
  }
  if (state.isSelected) {
    active.add('selected')
  }
  if (state.isHighlighted) {
    active.add('highlighted')
  }

  return active
}

export const toMultiSelectThemeResolvers: ComponentThemeResolver<MultiSelectThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: MultiSelectResolveState = {}) => componentTokens.multiSelect({
    themeTokens,
    semanticResolvers: semanticTokens,
    config: {
      hasSearch: state.hasSearch,
    },
    overrides: {
      color: state.color,
    },
    state: toDesignMultiSelectState(state),
  })

  const toTriggerState = (state: MultiSelectState): MultiSelectResolveState => ({
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
  })

  return {
    trigger: createStyleResolver((state: MultiSelectState): MultiSelectTriggerStyle => {
      const { trigger, stateLayer } = resolve(toTriggerState(state))
      return toContainerStyleWithStateLayer(trigger, stateLayer)
    }),
    triggerText: createStyleResolver((state: MultiSelectState): SelectTriggerTextStyle => (
      toTextStyle(resolve(toTriggerState(state)).triggerText)
    )),
    overlay: createSimpleStyleResolver((): SelectOverlayStyle => ({
      ...toContainerStyle(resolve().overlay),
      flex: 1,
    })),
    menu: createStyleResolver((state: SelectMenuState): SelectMenuStyle => (
      toContainerStyle(resolve({ hasSearch: state.hasSearch }).menu)
    )),
    header: createSimpleStyleResolver((): SelectHeaderStyle => (
      toContainerStyle(resolve().header)
    )),
    option: createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionStyle => (
      toContainerStyle(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).option)
    )),
    optionText: createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionTextStyle => (
      toTextStyle(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).optionText)
    )),
    emptyText: createSimpleStyleResolver((): SelectEmptyTextStyle => (
      toTextStyle(resolve().emptyText)
    )),
    checkbox: createStyleResolver((state: MultiSelectOptionState): MultiSelectCheckboxStyle => (
      toContainerStyle(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).checkbox)
    )),
    checkboxIcon: createValueResolver((state: MultiSelectOptionState): MultiSelectCheckboxIconStyle => {
      const { checkboxIcon } = resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      })

      return {
        color: checkboxIcon.color,
      }
    }),
  }
}
