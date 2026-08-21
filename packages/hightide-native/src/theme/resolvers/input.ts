import type {
  InputState as DesignInputState,
  InputStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
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

import { StyleAdapterUtils } from '../adapters'
import { HexColorUtils } from '../../utils/hex'

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
      if(container.backgroundColor && stateLayer.backgroundColor)
        container.backgroundColor = HexColorUtils.blend(
          HexColorUtils.resolveColorToken(container.backgroundColor),
          HexColorUtils.resolveColorToken(stateLayer.backgroundColor)
        )
      return StyleAdapterUtils.container(container)
    }),
    text: createStyleResolver((state: InputState): InputTextStyle => (
      StyleAdapterUtils.text(resolve(state).text)
    )),
    placeholder: createStyleResolver((state: InputState): InputPlaceholderStyle => (
      StyleAdapterUtils.text(resolve(state).placeholder)
    )),
    icon: createValueResolver((state: InputState): InputIconStyle => (
      StyleAdapterUtils.icon(resolve(state).icon)
    )),
  }
}
