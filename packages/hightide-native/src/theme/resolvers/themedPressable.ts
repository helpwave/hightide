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

import { StyleAdapterUtils } from '../adapters'

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
      ...StyleAdapterUtils.container(resolve(state).container),
      alignSelf: 'flex-start',
    })),
    stateLayer: createStyleResolver((state: ThemedPressableState): ThemedPressableStyle => {
      const tokens = resolve(state)

      return {
        ...StyleAdapterUtils.container(tokens.stateLayer),
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 20,
      }
    }),
    icon: createValueResolver((state: ThemedPressableState): ThemedPressableIconStyle => (
      StyleAdapterUtils.icon(resolve(state).icon)
    )),
    text: createStyleResolver((state: ThemedPressableState): ThemedPressableTextStyle => (
      StyleAdapterUtils.text(resolve(state).text)
    )),
  }
}
