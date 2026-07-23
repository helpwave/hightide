import type { TextStyle } from 'react-native'

import { componentLayouts } from '@helpwave/hightide-design/tokens'
import type {
  ComponentColorTokens,
  HightideDesignTokens as DesignTokensTheme
} from '@helpwave/hightide-design/types'

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
    const sizing = componentLayouts.input.md
    const borderColor = state.isInvalid ? semantic.negative : component.border

    return {
      minHeight: sizing.height,
      paddingHorizontal: sizing.paddingX,
      paddingVertical: sizing.paddingY,
      borderRadius: sizing.borderRadius,
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
