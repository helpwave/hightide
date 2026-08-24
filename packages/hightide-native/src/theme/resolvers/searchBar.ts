import type {
  InputState as DesignInputState,
  InputStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
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
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'
import { HexColorUtils } from '../../utils/hex'

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
      ...StyleAdapterUtils.container(resolve(state).container),
      position: 'relative',
      justifyContent: 'center',
    })),
    input: createStyleResolver((state: SearchBarState): SearchBarInputStyle => {
      const tokens = resolve(state)
      const { container, stateLayer, text } = tokens.input
      // TODO remove this computation with a better solution
      if(container.backgroundColor && stateLayer.backgroundColor)
        container.backgroundColor = HexColorUtils.blend(
          HexColorUtils.resolveColorToken(container.backgroundColor),
          HexColorUtils.resolveColorToken(stateLayer.backgroundColor)
        )

      const base = StyleAdapterUtils.container(container)
      const horizontalPadding = typeof base.paddingLeft === 'number'
        ? base.paddingLeft
        : typeof base.paddingRight === 'number'
          ? base.paddingRight
          : 0
      const iconButtonWidth = typeof tokens.iconButton.size?.width === 'number'
        ? tokens.iconButton.size.width
        : 0
      const iconButtonMargin = tokens.iconButton.margin?.type === 'physicalAxis'
        ? tokens.iconButton.margin.horizontal ?? 0
        : 0
      const trailingInset = iconButtonWidth + iconButtonMargin

      return {
        ...base,
        ...StyleAdapterUtils.text(text),
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding + trailingInset,
      }
    }),
    placeholder: createStyleResolver((state: SearchBarState): SearchBarPlaceholderStyle => (
      StyleAdapterUtils.text(resolve(state).input.placeholder)
    )),
    iconButton: createStyleResolver((state: SearchBarState): SearchBarIconButtonStyle => {
      const { iconButton } = resolve(state)
      const style = StyleAdapterUtils.container(iconButton)

      return {
        ...style,
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: [{ translateY: '-50%' }],
      }
    }),
    iconButtonColor: createStyleResolver((state: SearchBarState): ColorPairToken => {
      const iconColor = resolve(state).icon.color

      return {
        color: (iconColor === undefined || iconColor === 'transparent'
          ? themeTokens.color.surface.onColor
          : iconColor),
        onColor: themeTokens.color.surface.color,
      }
    }),
  }
}
