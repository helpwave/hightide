import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { createElementLayoutTokens } from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { TextStyleTokens } from './text-style-tokens'
import type {
  SelectMenuTokens,
  SelectOverlayTokens,
  SelectSearchTokens,
  SelectTriggerTokens
} from './select-tokens'
import { selectOverlayColor } from './select-tokens'

export type MultiSelectState = {
  isDisabled?: boolean,
  isInvalid?: boolean,
  isOpen?: boolean,
  hasSelections?: boolean,
  isSelected?: boolean,
  isHighlighted?: boolean,
}

export type MultiSelectTriggerTokens = SelectTriggerTokens & {
  gap: number,
}

export type MultiSelectOptionTokens = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: number,
  paddingVertical: number,
  paddingHorizontal: number,
  backgroundColor: ColorToken,
  opacity: number,
}

export type MultiSelectCheckboxTokens = {
  alignItems: 'center',
  justifyContent: 'center',
  width: number,
  height: number,
  borderRadius: number,
  borderWidth: number,
  borderColor: ColorToken,
  backgroundColor: ColorToken,
}

export type MultiSelectCheckboxIconTokens = {
  color: ColorToken,
  isVisible: boolean,
}

export type MultiSelectThemeTokens = {
  trigger: MultiSelectTriggerTokens,
  triggerText: TextStyleTokens,
  overlay: SelectOverlayTokens,
  menu: SelectMenuTokens,
  search: SelectSearchTokens,
  searchPlaceholderColor: ColorToken,
  option: MultiSelectOptionTokens,
  optionText: TextStyleTokens,
  checkbox: MultiSelectCheckboxTokens,
  checkboxIcon: MultiSelectCheckboxIconTokens,
}

export const hightideMultiSelectTokenResolver: ComponentTokenResolver<
  ThemeTokens,
  MultiSelectState,
  MultiSelectThemeTokens
> = ({ themeTokens, state }) => {
  const { color, spacing, shape, borders, typography } = themeTokens
  const layout = createElementLayoutTokens(themeTokens).control.md
  const checkboxSize = spacing.lg + spacing.xs

  return {
    trigger: {
      justifyContent: 'center',
      minHeight: layout.size,
      paddingVertical: spacing.md,
      paddingHorizontal: shape.padding.xxl,
      borderRadius: shape.borderRadius.sm,
      borderWidth: borders.borderWidths.thin,
      borderColor: state.isInvalid ? color.negative.color : color.border,
      backgroundColor: state.isDisabled ? color.disabled : color.surfaceVariant,
      gap: spacing.md,
      opacity: state.isDisabled ? 0.6 : 1,
    },
    triggerText: {
      ...typography.body.md,
      color: color.placeholder,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      padding: spacing.xl,
      backgroundColor: selectOverlayColor,
    },
    menu: {
      maxHeight: 360,
      borderRadius: shape.borderRadius.lg,
      borderWidth: borders.borderWidths.thin,
      borderColor: color.border,
      backgroundColor: color.surfaceVariant,
      overflow: 'hidden',
    },
    search: {
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: borders.borderWidths.thin,
      borderBottomColor: color.border,
      color: color.onSurface,
    },
    searchPlaceholderColor: color.placeholder,
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: shape.padding.xl,
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      backgroundColor: state.isHighlighted ? color.surfaceHover : color.transparent,
      opacity: state.isDisabled ? 0.5 : 1,
    },
    optionText: {
      ...typography.body.md,
      fontWeight: state.isSelected
        ? typography.fontWeights.semibold
        : typography.fontWeights.base,
      color: state.isSelected ? color.primary.color : color.onSurface,
    },
    checkbox: {
      alignItems: 'center',
      justifyContent: 'center',
      width: checkboxSize,
      height: checkboxSize,
      borderRadius: shape.borderRadius.xs,
      borderWidth: borders.borderWidths.thin,
      borderColor: state.isSelected ? color.primary.color : color.border,
      backgroundColor: state.isSelected ? color.primary.color : color.transparent,
    },
    checkboxIcon: {
      color: color.primary.onColor,
      isVisible: !!state.isSelected,
    },
  }
}
