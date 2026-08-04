import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { createElementLayoutTokens } from '../theme-tokens/element-layout'
import { HexColorUtils } from '../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { TextStyleTokens } from './text-style-tokens'

export type SelectState = {
  isDisabled?: boolean,
  isInvalid?: boolean,
  isOpen?: boolean,
  hasValue?: boolean,
  isSelected?: boolean,
  isHighlighted?: boolean,
}

export type SelectTriggerTokens = {
  justifyContent: 'center',
  minHeight: number,
  paddingVertical: number,
  paddingHorizontal: number,
  borderRadius: number,
  borderWidth: number,
  borderColor: ColorToken,
  backgroundColor: ColorToken,
  opacity: number,
}

export type SelectOverlayTokens = {
  flex: number,
  justifyContent: 'center',
  padding: number,
  backgroundColor: ColorToken,
}

export type SelectMenuTokens = {
  maxHeight: number,
  borderRadius: number,
  borderWidth: number,
  borderColor: ColorToken,
  backgroundColor: ColorToken,
  overflow: 'hidden',
}

export type SelectSearchTokens = {
  paddingVertical: number,
  paddingHorizontal: number,
  borderBottomWidth: number,
  borderBottomColor: ColorToken,
  color: ColorToken,
}

export type SelectOptionTokens = {
  paddingVertical: number,
  paddingHorizontal: number,
  backgroundColor: ColorToken,
  opacity: number,
}

export type SelectThemeTokens = {
  trigger: SelectTriggerTokens,
  triggerText: TextStyleTokens,
  overlay: SelectOverlayTokens,
  menu: SelectMenuTokens,
  search: SelectSearchTokens,
  searchPlaceholderColor: ColorToken,
  option: SelectOptionTokens,
  optionText: TextStyleTokens,
}

export const selectOverlayColor = HexColorUtils.hexWithAlpha('#000000', 0.35)

export const hightideSelectTokenResolver: ComponentTokenResolver<
  ThemeTokens,
  SelectState,
  SelectThemeTokens
> = ({ themeTokens, state }) => {
  const { color, spacing, shape, borders, typography } = themeTokens
  const layout = createElementLayoutTokens(themeTokens).control.md

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
      opacity: state.isDisabled ? 0.6 : 1,
    },
    triggerText: {
      ...typography.body.md,
      color: state.hasValue ? color.onSurface : color.placeholder,
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
  }
}
