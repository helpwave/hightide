import {
  inputElementSizes,
  remToPx,
  type ComponentColors,
  type DesignTheme as DesignTokensTheme,
  type SemanticColors
} from '@helpwave/hightide-design'
import type { TextStyle } from 'react-native'
import type { InputState, InputTheme } from '../types'
import { createStyleResolver, createValueResolver } from '../types/resolver'

export type CreateInputThemeOptions = {
  semantic: SemanticColors,
  component: ComponentColors,
}

export const createInputTheme = ({
  semantic,
  component,
}: CreateInputThemeOptions): InputTheme => {
  const resolveInput = (state: InputState): TextStyle => {
    const sizing = inputElementSizes.md
    const borderColor = state.isInvalid ? semantic.negative : component.border

    return {
      minHeight: remToPx(sizing.height),
      paddingHorizontal: remToPx(sizing.paddingX),
      paddingVertical: remToPx(sizing.paddingY),
      borderRadius: remToPx(sizing.borderRadius),
      borderWidth: 1,
      borderColor,
      backgroundColor: state.isDisabled ? semantic.disabled : component.input.background,
      color: state.isDisabled ? semantic.onDisabled : component.input.text,
      fontSize: 14,
      opacity: state.isDisabled ? 0.6 : 1,
    }
  }

  return {
    input: createStyleResolver(resolveInput),
    placeholderColor: createValueResolver(() => semantic.placeholder),
  }
}

export const createInputThemeFromDesign = (theme: DesignTokensTheme): InputTheme => {
  return createInputTheme({
    semantic: theme.semantic,
    component: theme.component,
  })
}
