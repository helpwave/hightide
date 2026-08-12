import type {
  SelectState as DesignSelectState,
  SelectStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import { toContainerStyle, toContainerStyleWithStateLayer, toTextStyle } from '../adapters/style-adapters'
import type {
  SelectIconStyle,
  SelectMenuStyle,
  SelectHeaderStyle,
  SelectEmptyTextStyle,
  SelectOptionState,
  SelectOptionStyle,
  SelectOptionTextStyle,
  SelectOverlayStyle,
  SelectState,
  SelectThemeResolvers,
  SelectTriggerStyle,
  SelectTriggerTextStyle
} from '../types/components/select'
import {
  createSimpleStyleResolver,
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

type SelectResolveState = {
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
}

const toDesignSelectState = (state: SelectResolveState = {}): DesignSelectState => {
  const active = new Set<SelectStateValue>()

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
  if (state.hasValue) {
    active.add('hasValue')
  }
  if (state.isSelected) {
    active.add('selected')
  }
  if (state.isHighlighted) {
    active.add('highlighted')
  }

  return active
}

export const toSelectThemeResolvers: ComponentThemeResolver<SelectThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: SelectResolveState = {}) => componentTokens.select({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      color: state.color,
    },
    state: toDesignSelectState(state),
  })

  const toTriggerState = (state: SelectState): SelectResolveState => ({
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
    trigger: createStyleResolver((state: SelectState): SelectTriggerStyle => {
      const { trigger, stateLayer } = resolve(toTriggerState(state))
      return toContainerStyleWithStateLayer(trigger, stateLayer)
    }),
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
    header: createSimpleStyleResolver((): SelectHeaderStyle => (
      toContainerStyle(resolve().header)
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
    emptyText: createSimpleStyleResolver((): SelectEmptyTextStyle => (
      toTextStyle(resolve().emptyText)
    )),
  }
}
