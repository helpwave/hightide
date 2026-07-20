import {
  remToPx,
  type ComponentColors,
  type DesignTheme as DesignTokensTheme,
  type SemanticColors
} from '@helpwave/hightide-design'
import type {
  SelectOptionState,
  SelectState,
  SelectTheme
} from '../types'

export type CreateSelectThemeOptions = {
  semantic: SemanticColors,
  component: ComponentColors,
}

export const createSelectTheme = ({
  semantic,
  component,
}: CreateSelectThemeOptions): SelectTheme => {
  return {
    trigger: (state: SelectState) => ({
      minHeight: 44,
      paddingHorizontal: remToPx('0.75rem'),
      paddingVertical: remToPx('0.5rem'),
      borderRadius: remToPx('0.375rem'),
      borderWidth: 1,
      borderColor: state.isInvalid ? semantic.negative : component.border,
      backgroundColor: state.isDisabled ? semantic.disabled : component.input.background,
      justifyContent: 'center',
      opacity: state.isDisabled ? 0.6 : 1,
    }),
    triggerText: (state: SelectState) => ({
      color: state.hasValue ? component.input.text : semantic.placeholder,
    }),
    overlay: () => ({
      flex: 1,
      backgroundColor: '#00000059',
      justifyContent: 'center',
      padding: 24,
    }),
    menu: () => ({
      maxHeight: 360,
      borderRadius: 12,
      backgroundColor: component.menu.background,
      borderWidth: 1,
      borderColor: component.menu.border,
      overflow: 'hidden',
    }),
    search: () => ({
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: component.menu.border,
      color: component.menu.text,
    }),
    searchPlaceholderColor: () => semantic.placeholder,
    option: (state: SelectOptionState) => ({
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: state.isHighlighted ? component.table.rowHoverBackground : 'transparent',
      opacity: state.isDisabled ? 0.5 : 1,
    }),
    optionText: (state: SelectOptionState) => ({
      color: state.isSelected ? semantic.primary : component.menu.text,
      fontWeight: state.isSelected ? '600' : '400',
    }),
  }
}

export const createSelectThemeFromDesign = (theme: DesignTokensTheme): SelectTheme => {
  return createSelectTheme({
    semantic: theme.semantic,
    component: theme.component,
  })
}
