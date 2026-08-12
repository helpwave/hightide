import type {
  InputState as DesignInputState,
  InputStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import { toContainerStyleWithStateLayer, toTextStyle } from '../adapters/style-adapters'
import type {
  InputContainerStyle,
  InputIconStyle,
  InputPlaceholderStyle,
  InputState,
  InputTextStyle,
  InputThemeResolvers
} from '../types/components/input'
import {
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

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
    container: createStyleResolver((state: InputState): InputContainerStyle => {
      const { container, stateLayer } = resolve(state)
      return toContainerStyleWithStateLayer(container, stateLayer)
    }),
    text: createStyleResolver((state: InputState): InputTextStyle => (
      toTextStyle(resolve(state).text)
    )),
    placeholder: createStyleResolver((state: InputState): InputPlaceholderStyle => (
      toTextStyle(resolve(state).placeholder)
    )),
    icon: createValueResolver((state: InputState): InputIconStyle => {
      const { icon } = resolve(state)

      return {
        size: icon.size,
        strokeWidth: icon.strokeWidth,
        color: icon.color,
      }
    }),
  }
}
