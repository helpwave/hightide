import type { Color } from '../types/color'
import type {
  InputState,
  InputStyle,
  InputThemeResolvers
} from '../types/components/input'
import {
  createSimpleValueResolver,
  createStyleResolver,
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
    state: {
      isDisabled: state.isDisabled,
      isFocused: state.isFocused,
      isInvalid: state.isInvalid,
      isReadOnly: state.isReadOnly,
    },
  })

  return {
    input: createStyleResolver((state: InputState): InputStyle => ({
      ...resolve(state).input,
    })),
    placeholderColor: createSimpleValueResolver((): Color => (
      resolve({}).placeholderColor
    )),
  }
}
