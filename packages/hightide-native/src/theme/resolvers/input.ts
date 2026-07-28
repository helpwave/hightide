import type { TextStyle } from 'react-native'

import {
  hightideBorder,
  hightideElements,
  hightideRadius,
  hightideSpacing,
  hightideTypography
} from '@helpwave/hightide-design/primitive'
import type {
  ComponentColorTokens,
  HightideThemeTokens as DesignTokensTheme
} from '@helpwave/hightide-design/theme'

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
  component: ComponentColorTokens,
}

export const createInputTheme = ({
  semantic,
  component,
}: CreateInputThemeOptions): InputTheme => {
  const resolveInput = (state: InputState): TextStyle => {
    const element = hightideElements.md
    const borderColor = state.isInvalid ? semantic.negative : component.border

    return {
      minHeight: element.size,
      paddingHorizontal: hightideSpacing.md,
      paddingVertical: hightideSpacing.sm,
      borderRadius: Number(hightideRadius.sm),
      borderWidth: hightideBorder.thin,
      borderColor,
      backgroundColor: state.isDisabled ? semantic.disabled : component.input.background,
      color: state.isDisabled ? semantic.onDisabled : component.input.text,
      fontSize: Number(hightideTypography.fontSize.sm),
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
