import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  InputContainerStyle,
  InputIconStyle,
  InputPlaceholderStyle,
  InputState,
  InputTextStyle,
  InputThemeResolvers
} from '../types/components/input'
import {
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

export const toInputThemeResolvers: ComponentThemeResolver<InputThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: InputState = {}) => componentTokens.input({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      color: state.color,
    },
    state: {
      isDisabled: state.isDisabled,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isFocusVisible: state.isFocusVisible,
      isPressed: state.isPressed,
      isInvalid: state.isInvalid,
      isReadonly: state.isReadonly,
    },
  })

  return {
    container: createStyleResolver((state: InputState): InputContainerStyle => (
      toContainerStyle(resolve(state).container)
    )),
    text: createStyleResolver((state: InputState): InputTextStyle => (
      toTextStyle(resolve(state).text)
    )),
    placeholder: createStyleResolver((state: InputState): InputPlaceholderStyle => (
      toTextStyle(resolve(state).placeholder)
    )),
    icon: createValueResolver((state: InputState): InputIconStyle => {
      const { icon } = resolve(state)

      return {
        size: icon.size,
        strokeWidth: icon.strokeWidth,
        color: icon.color,
      }
    }),
  }
}
