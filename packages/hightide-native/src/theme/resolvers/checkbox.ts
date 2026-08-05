import type {
  CheckboxIconStyle,
  CheckboxState,
  CheckboxStyle,
  CheckboxThemeResolvers
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
    config: {
      alwaysShowCheckIcon: state.alwaysShowCheckIcon,
    },
    overrides: {
      size: state.size,
      isRounded: state.isRounded,
    },
    state: {
      isDisabled: state.isDisabled,
      isChecked: state.isChecked,
      isIndeterminate: state.isIndeterminate,
      isInvalid: state.isInvalid,
    },
  })

  return {
    checkbox: createStyleResolver((state: CheckboxState): CheckboxStyle => ({
      ...resolve(state).box,
    })),
    icon: createValueResolver((state: CheckboxState): CheckboxIconStyle => {
      const { icon } = resolve(state)

      return {
        color: icon.color,
        size: icon.size,
        visible: icon.isVisible,
      }
    }),
  }
}
