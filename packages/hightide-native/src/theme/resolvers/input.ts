import type { TextStyle } from 'react-native'

import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import type { HightideSemanticColors } from '../types/color'
import type {
  InputState,
  InputTheme
} from '../types/components/input'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateInputThemeOptions = {
  semantic: HightideSemanticColors,
  input: ComponentTokens['input'],
}

export const createInputTheme = ({
  semantic,
  input,
}: CreateInputThemeOptions): InputTheme => {
  const resolveInput = (state: InputState): TextStyle => {
    const borderColor = state.isInvalid ? semantic.negative : semantic.border

    return {
      minHeight: input.size,
      paddingHorizontal: input.horizontalInset,
      paddingVertical: input.inset,
      borderRadius: input.radius,
      borderWidth: input.border,
      borderColor,
      backgroundColor: state.isDisabled ? semantic.disabled : input.background,
      color: state.isDisabled ? semantic.onDisabled : input.text,
      fontSize: input.fontSize,
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
    semantic: theme.semantic.colors,
    input: theme.components.input,
  })
}
