import { hightideTypography } from '@helpwave/hightide-design/primitive'
import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import type { HightideSemanticColors } from '../types/color'
import type {
  MultiSelectOptionState,
  MultiSelectState,
  MultiSelectTheme
} from '../types/components/multiSelect'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateMultiSelectThemeOptions = {
  semantic: HightideSemanticColors,
  input: ComponentTokens['input'],
  menu: ComponentTokens['menu'],
}

export const createMultiSelectTheme = ({
  semantic,
  input,
  menu,
}: CreateMultiSelectThemeOptions): MultiSelectTheme => {
  return {
    trigger: createStyleResolver((state: MultiSelectState) => ({
      minHeight: 44,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: state.isInvalid ? semantic.negative : semantic.border,
      backgroundColor: state.isDisabled ? semantic.disabled : input.background,
      justifyContent: 'center',
      gap: 8,
      opacity: state.isDisabled ? 0.6 : 1,
    })),
    triggerText: createStyleResolver(() => ({
      color: semantic.placeholder,
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
    option: createStyleResolver((state: MultiSelectOptionState) => ({
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: state.isHighlighted ? semantic.surfaceHover : semantic.transparent,
      opacity: state.isDisabled ? 0.5 : 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    })),
    optionText: createStyleResolver((state: MultiSelectOptionState) => ({
      color: state.isSelected ? semantic.primary : menu.text,
      fontWeight: state.isSelected ? hightideTypography.fontWeight.semibold : hightideTypography.fontWeight.base,
    })),
    checkbox: createStyleResolver((state: MultiSelectOptionState) => ({
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: state.isSelected ? semantic.primary : semantic.border,
      backgroundColor: state.isSelected ? semantic.primary : semantic.transparent,
      alignItems: 'center',
      justifyContent: 'center',
    })),
    checkboxIcon: createValueResolver((state: MultiSelectOptionState) => ({
      color: semantic.onPrimary,
      visible: !!state.isSelected,
    })),
  }
}

export const createMultiSelectThemeFromDesign = (theme: DesignTokensTheme): MultiSelectTheme => {
  return createMultiSelectTheme({
    semantic: theme.semantic.colors,
    input: theme.components.input,
    menu: theme.components.menu,
  })
}
