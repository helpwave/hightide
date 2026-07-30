import type { TextStyle } from 'react-native'

import type { HightideComponentTokens } from '@helpwave/hightide-design/component-tokens'
import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { HightideColorSchemes, HightideSemanticColorTokens } from '@helpwave/hightide-design/semantic-tokens'

import type {
  InputState,
  InputTheme
} from '../types/components/input'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateInputThemeOptions = {
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideColorSchemes,
  input: HightideComponentTokens['input'],
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
    colors: theme.colors,
    colorSchemes: theme.colorSchemes,
    input: theme.components.input,
  })
}
