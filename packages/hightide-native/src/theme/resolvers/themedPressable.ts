import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  ThemedPressableState,
  ThemedPressableStyle,
  ThemedPressableTextStyle,
  ThemedPressableThemeResolvers
} from '../types/components/themedPressable'
import {
  createStyleResolver,
  toPressableInteractionState,
  type ComponentThemeResolver
} from '../types/resolver'

export const toThemedPressableThemeResolvers: ComponentThemeResolver<ThemedPressableThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: ThemedPressableState) => componentTokens.pressable({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      size: state.size,
      color: state.color,
      coloringStyle: state.coloringStyle,
      coloringColorVariant: state.coloringColorVariant,
      hasAdditionalHorizontalPadding: state.hasAdditionalHorizontalPadding,
    },
    state: toPressableInteractionState(state),
  })

  return {
    touchTarget: createStyleResolver((state: ThemedPressableState): ThemedPressableStyle => ({
      ...toContainerStyle(resolve(state).touchTarget),
      alignSelf: 'flex-start',
    })),
    visualContainer: createStyleResolver((state: ThemedPressableState): ThemedPressableStyle => ({
      ...toContainerStyle(resolve(state).visualContainer),
      overflow: 'hidden',
    })),
    stateLayer: createStyleResolver((state: ThemedPressableState): ThemedPressableStyle => {
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
    text: createStyleResolver((state: ThemedPressableState): ThemedPressableTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
