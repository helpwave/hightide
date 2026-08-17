import { toContainerStyle } from '../adapters/container-adapter'
import { toIconStyle } from '../adapters/icon-style-adapter'
import { toTextStyle } from '../adapters/text-style-adapter'
import type {
  ThemedPressableIconStyle,
  ThemedPressableState,
  ThemedPressableStyle,
  ThemedPressableTextStyle,
  ThemedPressableThemeResolvers
} from '../types/components/themedPressable'
import {
  createStyleResolver,
  createValueResolver,
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
    container: createStyleResolver((state: ThemedPressableState): ThemedPressableStyle => ({
      ...toContainerStyle(resolve(state).container),
      alignSelf: 'flex-start',
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
    icon: createValueResolver((state: ThemedPressableState): ThemedPressableIconStyle => (
      toIconStyle(resolve(state).icon)
    )),
    text: createStyleResolver((state: ThemedPressableState): ThemedPressableTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
