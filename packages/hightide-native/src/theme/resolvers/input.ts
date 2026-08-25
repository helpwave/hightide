import type {
  InputState as DesignInputState,
  InputStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import type {
  InputContainerStyle,
  InputIconStyle,
  InputPlaceholderStyle,
  InputState,
  InputStateLayerStyle,
  InputTextStyle,
  InputThemeResolvers
} from '../types/components/input'
import {
  createStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'

const toDesignInputState = (state: InputState = {}): DesignInputState => {
  const active = new Set<InputStateValue>()

  if (state.isDisabled) {
    active.add('disabled')
  }
  if (state.isFocused) {
    active.add('focused')
  }
  if (state.isFocusVisible) {
    active.add('focusVisible')
  }
  if (state.isHovered) {
    active.add('hovered')
  }
  if (state.isPressed) {
    active.add('pressed')
  }
  if (state.isReadonly) {
    active.add('readonly')
  }
  if (state.isInvalid) {
    active.add('invalid')
  }

  return active
}

export const toInputThemeResolvers: ComponentThemeResolver<InputThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: InputState = {}) => componentTokens.input({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      color: state.color,
    },
    state: toDesignInputState(state),
  })

  return {
    container: createStyleResolver((state: InputState): InputContainerStyle => (
      StyleAdapterUtils.container(resolve(state).container)
    )),
    stateLayer: createStyleResolver((state: InputState): InputStateLayerStyle => {
      const style = resolve(state)
      const stateLayer = style.stateLayer
      const container = style.container
      const resolvedContainerBorder = StyleAdapterUtils.borderWidth(container.border?.width)
      return {
        ...StyleAdapterUtils.container(stateLayer),
        ...StyleAdapterUtils.position({
          type: 'absolute',
          zIndex: stateLayer.position?.zIndex ?? 20,
          bottom: -(resolvedContainerBorder?.borderBottomWidth ?? 0),
          top: -(resolvedContainerBorder?.borderTopWidth ?? 0),
          left: -(resolvedContainerBorder?.borderLeftWidth ?? 0),
          right: -(resolvedContainerBorder?.borderRightWidth ?? 0),
        })
      }
    }),
    text: createStyleResolver((state: InputState): InputTextStyle => {
      const style = resolve(state).text
      return {
        ...StyleAdapterUtils.text(style),
        flex: 1,
        padding: 0,
        margin: 0,
      }
    }),
    placeholder: createStyleResolver((state: InputState): InputPlaceholderStyle => (
      StyleAdapterUtils.text(resolve(state).placeholder)
    )),
    icon: createStyleResolver((state: InputState): InputIconStyle => (
      StyleAdapterUtils.icon(resolve(state).icon)
    )),
  }
}
