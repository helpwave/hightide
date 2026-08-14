import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  ButtonIconStyle,
  ButtonState,
  ButtonStyle,
  ButtonTextStyle,
  ButtonThemeResolvers
} from '../types/components/button'
import {
  createStyleResolver,
  createValueResolver,
  toPressableInteractionState,
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
      variant: state.variant,
    },
    state: toPressableInteractionState(state),
  })

  return {
    container: createStyleResolver((state: ButtonState): ButtonStyle => ({
      ...toContainerStyle(resolve(state).container),
      alignSelf: 'flex-start',
    })),
    stateLayer: createStyleResolver((state: ButtonState): ButtonStyle => {
      const tokens = resolve(state)
      return {
        ...toContainerStyle(tokens.stateLayer),
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }
    }),
    icon: createValueResolver((state: ButtonState): ButtonIconStyle => {
      const { icon } = resolve(state)

      return {
        color: icon.color,
        size: icon.size,
        strokeWidth: icon.strokeWidth,
      }
    }),
    text: createStyleResolver((state: ButtonState): ButtonTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
