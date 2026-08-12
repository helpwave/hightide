import type {
  InputState as DesignInputState,
  InputStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import { toContainerStyle, toContainerStyleWithStateLayer, toTextStyle } from '../adapters/style-adapters'
import type {
  SearchBarContainerStyle,
  SearchBarIconButtonStyle,
  SearchBarInputStyle,
  SearchBarPlaceholderStyle,
  SearchBarState,
  SearchBarThemeResolvers
} from '../types/components/searchBar'
import {
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

const toDesignSearchBarState = (state: SearchBarState = {}): DesignInputState => {
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

export const toSearchBarThemeResolvers: ComponentThemeResolver<SearchBarThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: SearchBarState = {}) => componentTokens.searchBar({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      color: state.color,
    },
    state: toDesignSearchBarState(state),
  })

  return {
    container: createStyleResolver((state: SearchBarState): SearchBarContainerStyle => ({
      ...toContainerStyle(resolve(state).container),
      position: 'relative',
      justifyContent: 'center',
    })),
    input: createStyleResolver((state: SearchBarState): SearchBarInputStyle => {
      const tokens = resolve(state)
      const { container, stateLayer, text } = tokens.input
      const base = toContainerStyleWithStateLayer(container, stateLayer)
      const horizontalPadding = typeof base.paddingHorizontal === 'number'
        ? base.paddingHorizontal
        : 0

      return {
        ...base,
        ...toTextStyle(text),
        paddingHorizontal: undefined,
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding + tokens.trailingInset,
      }
    }),
    placeholder: createStyleResolver((state: SearchBarState): SearchBarPlaceholderStyle => (
      toTextStyle(resolve(state).input.placeholder)
    )),
    iconButton: createStyleResolver((state: SearchBarState): SearchBarIconButtonStyle => {
      const { iconButton } = resolve(state)
      const style = toContainerStyle(iconButton)

      return {
        ...style,
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: [{ translateY: '-50%' }],
      }
    }),
    iconButtonColor: createValueResolver((state: SearchBarState): ColorPairToken => (
      resolve(state).iconButtonColor
    )),
  }
}
