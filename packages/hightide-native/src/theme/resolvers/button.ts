import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  ButtonState,
  ButtonStyle,
  ButtonTextStyle,
  ButtonThemeResolvers
} from '../types/components/button'
import {
  createStyleResolver,
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
    touchTarget: createStyleResolver((state: ButtonState): ButtonStyle => ({
      ...toContainerStyle(resolve(state).touchTarget),
      alignSelf: 'flex-start'
    })),
    visualContainer: createStyleResolver((state: ButtonState): ButtonStyle => ({
      ...toContainerStyle(resolve(state).visualContainer),
      overflow: 'hidden',
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
    text: createStyleResolver((state: ButtonState): ButtonTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
