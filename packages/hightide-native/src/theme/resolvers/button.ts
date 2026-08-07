import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  ButtonState,
  ButtonStyle,
  ButtonTextStyle,
  ButtonThemeResolvers
} from '../types/components/button'
import {
  createStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

export const toButtonThemeResolvers: ComponentThemeResolver<ButtonThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: ButtonState) => componentTokens.button({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      size: state.size,
      color: state.color,
      coloringStyle: state.coloringStyle,
    },
    state: {
      isDisabled: state.isDisabled,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isFocusVisible: state.isFocusVisible,
      isPressed: state.isPressed,
    },
  })

  return {
    container: createStyleResolver((state: ButtonState): ButtonStyle => (
      toContainerStyle(resolve(state).container)
    )),
    text: createStyleResolver((state: ButtonState): ButtonTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
