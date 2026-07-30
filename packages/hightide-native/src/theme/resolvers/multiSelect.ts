import { hightideTypography } from '@helpwave/hightide-design/primitive'
import type { HightideComponentTokens } from '@helpwave/hightide-design/components'
import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { HightideColorSchemes, HightideSemanticColorTokens } from '@helpwave/hightide-design/semantic'

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
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideColorSchemes,
  input: HightideComponentTokens['input'],
  menu: HightideComponentTokens['menu'],
}

export const createMultiSelectTheme = ({
  colors,
  colorSchemes,
  input,
  menu,
}: CreateMultiSelectThemeOptions): MultiSelectTheme => {
  const primary = colorSchemes.primary.filled.base

  return {
    trigger: createStyleResolver((state: MultiSelectState) => ({
      minHeight: 44,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: state.isInvalid
        ? colorSchemes.negative.text.base.foreground
        : colors.border,
      backgroundColor: state.isDisabled ? colors.disabled : input.background,
      justifyContent: 'center',
      gap: 8,
      opacity: state.isDisabled ? 0.6 : 1,
    })),
    triggerText: createStyleResolver(() => ({
      color: colors.placeholder,
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
    searchPlaceholderColor: createValueResolver(() => colors.placeholder),
    option: createStyleResolver((state: MultiSelectOptionState) => ({
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: state.isHighlighted ? colors.surfaceHover : colors.transparent,
      opacity: state.isDisabled ? 0.5 : 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    })),
    optionText: createStyleResolver((state: MultiSelectOptionState) => ({
      color: state.isSelected ? colorSchemes.primary.text.base.foreground : menu.text,
      fontWeight: state.isSelected ? hightideTypography.fontWeight.semibold : hightideTypography.fontWeight.base,
    })),
    checkbox: createStyleResolver((state: MultiSelectOptionState) => ({
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: state.isSelected ? primary.background : colors.border,
      backgroundColor: state.isSelected ? primary.background : colors.transparent,
      alignItems: 'center',
      justifyContent: 'center',
    })),
    checkboxIcon: createValueResolver((state: MultiSelectOptionState) => ({
      color: primary.foreground,
      visible: !!state.isSelected,
    })),
  }
}

export const createMultiSelectThemeFromDesign = (theme: DesignTokensTheme): MultiSelectTheme => {
  return createMultiSelectTheme({
    colors: theme.semantic.colors,
    colorSchemes: theme.semantic.colorSchemes,
    input: theme.components.input,
    menu: theme.components.menu,
  })
}
