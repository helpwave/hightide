import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  IconButtonIconStyle,
  IconButtonState,
  IconButtonStyle,
  IconButtonTextStyle,
  IconButtonThemeResolvers
} from '../types/components/iconButton'
import {
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

export const toIconButtonThemeResolvers: ComponentThemeResolver<IconButtonThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: IconButtonState) => componentTokens.iconButton({
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
    button: createStyleResolver((state: IconButtonState): IconButtonStyle => (
      toContainerStyle(resolve(state).container)
    )),
    icon: createValueResolver((state: IconButtonState): IconButtonIconStyle => {
      const { icon } = resolve(state)

      return {
        size: icon.size,
        strokeWidth: icon.strokeWidth,
        color: icon.color,
      }
    }),
    text: createStyleResolver((state: IconButtonState): IconButtonTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
