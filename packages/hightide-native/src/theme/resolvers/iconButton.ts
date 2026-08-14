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
  toPressableInteractionState,
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
      variant: state.variant,
    },
    state: toPressableInteractionState(state),
  })

  return {
    container: createStyleResolver((state: IconButtonState): IconButtonStyle => ({
      ...toContainerStyle(resolve(state).container),
    })),
    stateLayer: createStyleResolver((state: IconButtonState): IconButtonStyle => {
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
