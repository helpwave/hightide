import type {
  SelectState as DesignSelectState,
  SelectStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import type {
  SelectIconStyle,
  SelectMenuStyle,
  SelectMenuState,
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
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'

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
  hasSearch?: boolean,
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
    config: {
      hasSearch: state.hasSearch,
    },
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
    trigger: createStyleResolver((state: SelectState): SelectTriggerStyle => ({
      ...StyleAdapterUtils.container(resolve(toTriggerState(state)).trigger),
      overflow: 'hidden',
    })),
    stateLayer: createStyleResolver((state: SelectState): SelectTriggerStyle => ({
      ...StyleAdapterUtils.container(resolve(toTriggerState(state)).stateLayer),
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    })),
    triggerText: createStyleResolver((state: SelectState): SelectTriggerTextStyle => (
      StyleAdapterUtils.text(resolve(toTriggerState(state)).triggerText)
    )),
    icon: createStyleResolver((state: SelectState): SelectIconStyle => (
      StyleAdapterUtils.icon(resolve(toTriggerState(state)).icon)
    )),
    overlay: createSimpleStyleResolver((): SelectOverlayStyle => ({
      ...StyleAdapterUtils.container(resolve().overlay),
      flex: 1,
    })),
    menu: createStyleResolver((state: SelectMenuState): SelectMenuStyle => (
      StyleAdapterUtils.container(resolve({ hasSearch: state.hasSearch }).menu)
    )),
    header: createSimpleStyleResolver((): SelectHeaderStyle => (
      StyleAdapterUtils.container(resolve().header)
    )),
    option: createStyleResolver((state: SelectOptionState): SelectOptionStyle => (
      StyleAdapterUtils.container(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).option)
    )),
    optionText: createStyleResolver((state: SelectOptionState): SelectOptionTextStyle => (
      StyleAdapterUtils.text(resolve({
        color: state.color,
        isDisabled: state.isDisabled,
        isSelected: state.isSelected,
        isHighlighted: state.isHighlighted,
      }).optionText)
    )),
    emptyText: createSimpleStyleResolver((): SelectEmptyTextStyle => (
      StyleAdapterUtils.text(resolve().emptyText)
    )),
  }
}
