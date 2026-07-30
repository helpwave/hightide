import type { TextStyle } from 'react-native'

import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { ColorSchemes, SemanticColorTokens } from '@helpwave/hightide-design/semantic'

import type {
  InputState,
  InputTheme
} from '../types/components/input'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateInputThemeOptions = {
  colors: SemanticColorTokens,
  colorSchemes: ColorSchemes,
  input: ComponentTokens['input'],
}

export const createInputTheme = ({
  colors,
  colorSchemes,
  input,
}: CreateInputThemeOptions): InputTheme => {
  const resolveInput = (state: InputState): TextStyle => {
    const borderColor = state.isInvalid
      ? colorSchemes.negative.text.base.foreground
      : colors.border

    return {
      minHeight: input.size,
      paddingHorizontal: input.horizontalInset,
      paddingVertical: input.inset,
      borderRadius: input.radius,
      borderWidth: input.border,
      borderColor,
      backgroundColor: state.isDisabled ? colors.disabled : input.background,
      color: state.isDisabled ? colors.onDisabled : input.text,
      fontSize: input.fontSize,
      opacity: state.isDisabled ? 0.6 : 1,
    }
  }

  return {
    input: createStyleResolver(resolveInput),
    placeholderColor: createValueResolver(() => colors.placeholder),
  }
}

export const createInputThemeFromDesign = (theme: DesignTokensTheme): InputTheme => {
  return createInputTheme({
    colors: theme.semantic.colors,
    colorSchemes: theme.semantic.colorSchemes,
    input: theme.components.input,
  })
}
