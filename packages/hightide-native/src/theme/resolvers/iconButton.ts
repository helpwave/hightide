import type {
  IconButtonIconStyle,
  IconButtonState,
  IconButtonStyle,
  IconButtonThemeResolvers
} from '../types/components/iconButton'
import {
  createStyleResolver,
  createValueResolver,
  toPressableInteractionState,
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'

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
      ...StyleAdapterUtils.container(resolve(state).container),
    })),
    stateLayer: createStyleResolver((state: IconButtonState): IconButtonStyle => {
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
    icon: createValueResolver((state: IconButtonState): IconButtonIconStyle => (
      StyleAdapterUtils.icon(resolve(state).icon)
    )),
  }
}
