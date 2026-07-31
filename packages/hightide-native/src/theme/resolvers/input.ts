import type { TextStyle } from 'react-native'

import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import type {
  InputState,
  InputStyle,
  InputTheme
} from '../types/components/input'
import type { Color } from '../types/color'
import type {
  SimpleStyleResolver,
  StyleResolverFunction
} from '../types/resolver'
import {
  createSimpleValueResolver,
  createStyleResolver
} from '../types/resolver'

export const createInputContainerTheme = (
  theme: HightideDesignSystemTokens
): StyleResolverFunction<InputState, InputStyle> => {
  const { colors, colorSchemes, components } = theme
  const input = components.input

  return createStyleResolver((state: InputState): InputStyle => {
    const borderColor = state.isInvalid
      ? colorSchemes.negative.text.base.foreground
      : colors.border

    return {
      minHeight: input.size,
      paddingHorizontal: input.horizontalInset,
      paddingVertical: input.inset,
      borderRadius: input.borderRadius,
      borderWidth: input.borderWidth,
      borderColor,
      backgroundColor: state.isDisabled ? colors.disabled : input.background,
      color: state.isDisabled ? colors.onDisabled : input.text,
      fontSize: Number(input.textStyle.fontSize),
      fontWeight: input.textStyle.fontWeight as TextStyle['fontWeight'],
      fontFamily: input.textStyle.fontFamily,
      lineHeight: typeof input.textStyle.lineHeight === 'number'
        ? input.textStyle.lineHeight
        : Number(input.textStyle.lineHeight),
      opacity: state.isDisabled ? 0.6 : 1,
    }
  })
}

export const createInputPlaceholderColorTheme = (
  theme: HightideDesignSystemTokens
): SimpleStyleResolver<Color> => {
  return createSimpleValueResolver((): Color => theme.colors.placeholder)
}

export const createInputTheme = (theme: HightideDesignSystemTokens): InputTheme => ({
  input: createInputContainerTheme(theme),
  placeholderColor: createInputPlaceholderColorTheme(theme),
})
