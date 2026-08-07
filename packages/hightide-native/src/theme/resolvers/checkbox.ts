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
    state: {
      isDisabled: state.isDisabled,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isPressed: state.isPressed,
      isReadonly: state.isReadonly,
      isInvalid: state.isInvalid,
      isChecked: state.isChecked,
      isIndeterminate: state.isIndeterminate,
    },
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
