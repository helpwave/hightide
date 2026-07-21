import { remToPx } from '@helpwave/hightide-design/helpers'
import { fontWeights } from '@helpwave/hightide-design/tokens'
import {
  type ComponentColors,
  type DesignTokens as DesignTokensTheme,
  type SemanticColors
} from '@helpwave/hightide-design/types'
import type {
  SelectOptionState,
  SelectState,
  SelectTheme
} from '../types'
import { createStyleResolver, createValueResolver } from '../types/resolver'

export type CreateSelectThemeOptions = {
  semantic: SemanticColors,
  component: ComponentColors,
}

export const createSelectTheme = ({
  semantic,
  component,
}: CreateSelectThemeOptions): SelectTheme => {
  return {
    trigger: createStyleResolver((state: SelectState) => ({
      minHeight: 44,
      paddingHorizontal: remToPx('0.75rem'),
      paddingVertical: remToPx('0.5rem'),
      borderRadius: remToPx('0.375rem'),
      borderWidth: 1,
      borderColor: state.isInvalid ? semantic.negative : component.border,
      backgroundColor: state.isDisabled ? semantic.disabled : component.input.background,
      justifyContent: 'center',
      opacity: state.isDisabled ? 0.6 : 1,
    })),
    triggerText: createStyleResolver((state: SelectState) => ({
      color: state.hasValue ? component.input.text : semantic.placeholder,
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
    option: createStyleResolver((state: SelectOptionState) => ({
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: state.isHighlighted ? component.table.rowHoverBackground : 'transparent',
      opacity: state.isDisabled ? 0.5 : 1,
    })),
    optionText: createStyleResolver((state: SelectOptionState) => ({
      color: state.isSelected ? semantic.primary : component.menu.text,
      fontWeight: state.isSelected ? fontWeights.semibold : fontWeights.base,
    })),
  }
}

export const createSelectThemeFromDesign = (theme: DesignTokensTheme): SelectTheme => {
  return createSelectTheme({
    semantic: theme.semantic,
    component: theme.component,
  })
}
