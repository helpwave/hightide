import type { TextStyle } from 'react-native'

import type {
  ComponentColorTokens,
  ComponentLayoutTokens
} from '@helpwave/hightide-design/components'
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
  component: ComponentColorTokens,
  layout: ComponentLayoutTokens['input']['md'],
}

export const createInputTheme = ({
  semantic,
  component,
  layout,
}: CreateInputThemeOptions): InputTheme => {
  const resolveInput = (state: InputState): TextStyle => {
    const borderColor = state.isInvalid ? semantic.negative : component.border

    return {
      minHeight: layout.size,
      paddingHorizontal: layout.horizontalInset,
      paddingVertical: layout.inset,
      borderRadius: layout.radius,
      borderWidth: layout.border,
      borderColor,
      backgroundColor: state.isDisabled ? semantic.disabled : component.input.background,
      color: state.isDisabled ? semantic.onDisabled : component.input.text,
      fontSize: layout.fontSize,
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
    component: theme.components.colors,
    layout: theme.components.layout.input.md,
  })
}
