import { hightideTypography } from '@helpwave/hightide-design/primitive'
import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import type { HightideSemanticColors } from '../types/color'
import type { HightideComponentThemes } from '../types/components/hightide'
import type {
  SelectOptionState,
  SelectState,
  SelectTheme
} from '../types/components/select'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateSelectThemeOptions = {
  semantic: HightideSemanticColors,
  colorSchemes: HightideComponentThemes['colorSchemes'],
  input: ComponentTokens['input'],
  menu: ComponentTokens['menu'],
}

export const createSelectTheme = ({
  semantic,
  colorSchemes,
  input,
  menu,
}: CreateSelectThemeOptions): SelectTheme => {
  return {
    trigger: createStyleResolver((state: SelectState) => ({
      minHeight: 44,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: state.isInvalid
        ? colorSchemes.negative.text.base.foreground
        : semantic.border,
      backgroundColor: state.isDisabled ? semantic.disabled : input.background,
      justifyContent: 'center',
      opacity: state.isDisabled ? 0.6 : 1,
    })),
    triggerText: createStyleResolver((state: SelectState) => ({
      color: state.hasValue ? input.text : semantic.placeholder,
    })),
    overlay: createStyleResolver(() => ({
      flex: 1,
      backgroundColor: '#00000059',
      justifyContent: 'center',
      padding: 24,
    })),
    menu: createStyleResolver(() => ({
      maxHeight: 360,
      borderRadius: 12,
      backgroundColor: menu.background,
      borderWidth: 1,
      borderColor: menu.border,
      overflow: 'hidden',
    })),
    search: createStyleResolver(() => ({
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: menu.border,
      color: menu.text,
    })),
    searchPlaceholderColor: createValueResolver(() => semantic.placeholder),
    option: createStyleResolver((state: SelectOptionState) => ({
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: state.isHighlighted ? semantic.surfaceHover : semantic.transparent,
      opacity: state.isDisabled ? 0.5 : 1,
    })),
    optionText: createStyleResolver((state: SelectOptionState) => ({
      color: state.isSelected ? colorSchemes.primary.text.base.foreground : menu.text,
      fontWeight: state.isSelected ? hightideTypography.fontWeight.semibold : hightideTypography.fontWeight.base,
    })),
  }
}

export const createSelectThemeFromDesign = (theme: DesignTokensTheme): SelectTheme => {
  return createSelectTheme({
    semantic: theme.semantic.colors,
    colorSchemes: theme.semantic.colorSchemes,
    input: theme.components.input,
    menu: theme.components.menu,
  })
}
