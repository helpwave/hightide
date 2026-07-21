import {
  remToPx,
  type ComponentColors,
  type DesignTheme as DesignTokensTheme,
  type SemanticColors
} from '@helpwave/hightide-design'
import type {
  MultiSelectOptionState,
  MultiSelectState,
  MultiSelectTheme
} from '../types'
import { createStyleResolver, createValueResolver } from '../types/resolver'

export type CreateMultiSelectThemeOptions = {
  semantic: SemanticColors,
  component: ComponentColors,
}

export const createMultiSelectTheme = ({
  semantic,
  component,
}: CreateMultiSelectThemeOptions): MultiSelectTheme => {
  return {
    trigger: createStyleResolver((state: MultiSelectState) => ({
      minHeight: 44,
      paddingHorizontal: remToPx('0.75rem'),
      paddingVertical: remToPx('0.5rem'),
      borderRadius: remToPx('0.375rem'),
      borderWidth: 1,
      borderColor: state.isInvalid ? semantic.negative : component.border,
      backgroundColor: state.isDisabled ? semantic.disabled : component.input.background,
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
      backgroundColor: component.menu.background,
      borderWidth: 1,
      borderColor: component.menu.border,
      overflow: 'hidden',
    })),
    search: createStyleResolver(() => ({
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: component.menu.border,
      color: component.menu.text,
    })),
    searchPlaceholderColor: createValueResolver(() => semantic.placeholder),
    option: createStyleResolver((state: MultiSelectOptionState) => ({
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: state.isHighlighted ? component.table.rowHoverBackground : 'transparent',
      opacity: state.isDisabled ? 0.5 : 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    })),
    optionText: createStyleResolver((state: MultiSelectOptionState) => ({
      color: state.isSelected ? semantic.primary : component.menu.text,
      fontWeight: state.isSelected ? '600' : '400',
    })),
    checkbox: createStyleResolver((state: MultiSelectOptionState) => ({
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: state.isSelected ? semantic.primary : component.border,
      backgroundColor: state.isSelected ? semantic.primary : 'transparent',
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
    semantic: theme.semantic,
    component: theme.component,
  })
}
