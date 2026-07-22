import { remToPx } from '@helpwave/hightide-design/helpers'
import { inputElementSizes } from '@helpwave/hightide-design/tokens'
import {
  type ComponentColorTokens,
  type HightideDesignTokens as DesignTokensTheme
} from '@helpwave/hightide-design/types'
import type { TextStyle } from 'react-native'
import type { HightideSemanticColors, InputState, InputTheme } from '../types'
import { createStyleResolver, createValueResolver } from '../types/resolver'

export type CreateInputThemeOptions = {
  semantic: HightideSemanticColors,
  component: ComponentColorTokens,
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
    semantic: theme.semanticColors,
    component: theme.componentColors,
  })
}
