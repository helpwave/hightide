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

import { StyleAdapterUtils } from '../adapters'

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
      ...StyleAdapterUtils.container(resolve(state).container),
      alignSelf: 'flex-start',
    })),
    stateLayer: createStyleResolver((state: ButtonState): ButtonStyle => {
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
    icon: createValueResolver((state: ButtonState): ButtonIconStyle => (
      StyleAdapterUtils.icon(resolve(state).icon)
    )),
    text: createStyleResolver((state: ButtonState): ButtonTextStyle => (
      StyleAdapterUtils.text(resolve(state).text)
    )),
  }
}
