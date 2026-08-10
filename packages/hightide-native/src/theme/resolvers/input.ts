import type { ColorToken, HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
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

const blendWithStateLayer = (
  base: ColorToken | undefined,
  tint: ColorToken
): ColorToken | undefined => {
  if (base === undefined || tint === 'transparent' || base === 'transparent') {
    return base
  }

  return HexColorUtils.blend(base as HexColorToken, tint as HexColorToken)
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
    state: {
      isDisabled: state.isDisabled,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isFocusVisible: state.isFocusVisible,
      isPressed: state.isPressed,
      isInvalid: state.isInvalid,
      isReadonly: state.isReadonly,
    },
  })

  return {
    container: createStyleResolver((state: InputState): InputContainerStyle => {
      const { container, stateLayer } = resolve(state)
      const tint = stateLayer.backgroundColor ?? 'transparent'
      const borderColor = container.border?.color

      return toContainerStyle({
        ...container,
        backgroundColor: blendWithStateLayer(container.backgroundColor, tint),
        border: container.border === undefined ? undefined : {
          ...container.border,
          color: borderColor?.type === 'all'
            ? {
              type: 'all',
              value: blendWithStateLayer(borderColor.value, tint) ?? borderColor.value,
            }
            : borderColor,
        },
      })
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
