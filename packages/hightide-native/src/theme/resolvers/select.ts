import { fontWeights } from '@helpwave/hightide-design/tokens'
import type {
  ComponentColorTokens,
  HightideDesignTokens as DesignTokensTheme
} from '@helpwave/hightide-design/types'

import type { HightideSemanticColors } from '@/src/theme/types/color'
import type {
  SelectOptionState,
  SelectState,
  SelectTheme
} from '@/src/theme/types/components/select'
import {
  createStyleResolver,
  createValueResolver
} from '@/src/theme/types/resolver'

export type CreateSelectThemeOptions = {
  semantic: HightideSemanticColors,
  component: ComponentColorTokens,
}

export const createSelectTheme = ({
  semantic,
  component,
}: CreateSelectThemeOptions): SelectTheme => {
  return {
    trigger: createStyleResolver((state: SelectState) => ({
      minHeight: 44,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
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
    semantic: theme.semanticColors,
    component: theme.componentColors,
  })
}
