import { hightideTypography } from '@helpwave/hightide-design/primitive'
import type { HightideComponentTokens } from '@helpwave/hightide-design/components'
import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { HightideColorSchemes, HightideSemanticColorTokens } from '@helpwave/hightide-design/semantic'

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
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideColorSchemes,
  input: HightideComponentTokens['input'],
  menu: HightideComponentTokens['menu'],
}

export const createSelectTheme = ({
  colors,
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
        : colors.border,
      backgroundColor: state.isDisabled ? colors.disabled : input.background,
      justifyContent: 'center',
      opacity: state.isDisabled ? 0.6 : 1,
    })),
    triggerText: createStyleResolver((state: SelectState) => ({
      color: state.hasValue ? input.text : colors.placeholder,
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
    option: createStyleResolver((state: SelectOptionState) => ({
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: state.isHighlighted ? colors.surfaceHover : colors.transparent,
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
    colors: theme.semantic.colors,
    colorSchemes: theme.semantic.colorSchemes,
    input: theme.components.input,
    menu: theme.components.menu,
  })
}
