import type {
  CheckboxState as DesignCheckboxState,
  CheckboxStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import { toContainerStyle } from '../adapters/style-adapters'
import type {
  CheckboxIconStyle,
  CheckboxState,
  CheckboxStyle,
  CheckboxThemeResolvers,
  CheckboxVisualContainerStyle
} from '../types/components/checkbox'
import {
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

const toDesignCheckboxState = (state: CheckboxState): DesignCheckboxState => {
  const active = new Set<CheckboxStateValue>()

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
  if (state.isChecked) {
    active.add('checked')
  }
  if (state.isIndeterminate) {
    active.add('indeterminate')
  }

  return active
}

export const toCheckboxThemeResolvers: ComponentThemeResolver<CheckboxThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: CheckboxState) => componentTokens.checkbox({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      size: state.size,
      isRounded: state.isRounded,
      color: state.color,
    },
    state: toDesignCheckboxState(state),
  })

  return {
    container: createStyleResolver((state: CheckboxState): CheckboxStyle => (
      toContainerStyle(resolve(state).container)
    )),
    visualContainer: createStyleResolver((state: CheckboxState): CheckboxVisualContainerStyle => (
      toContainerStyle(resolve(state).visualContainer)
    )),
    icon: createValueResolver((state: CheckboxState): CheckboxIconStyle => {
      const { icon } = resolve(state)

      return {
        color: icon.color,
        size: icon.size,
        strokeWidth: icon.strokeWidth,
      }
    }),
  }
}
