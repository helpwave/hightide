import type { ColorToken } from '../primitive-tokens/color'
import {
  resolveColoringStyle,
  resolvePressableColoring
} from '../semantic-token-resolvers'
import { createElementLayoutTokens } from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'
import { toActivePressableStates } from './pressable'
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

export type MultiSelectComponentResolverProps = {
  state: MultiSelectState,
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

export type MultiSelectTokens = {
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

export type MultiSelectTokenResolver = ComponentTokenResolver<
  MultiSelectComponentResolverProps,
  MultiSelectTokens
>

export const multiSelectTokenResolver: MultiSelectTokenResolver = ({ themeTokens, semanticResolvers, state }) => {
  const { color, spacing, shape, borders, typography } = themeTokens
  const layout = createElementLayoutTokens(themeTokens).control.md
  const checkboxSize = spacing.lg + spacing.xs
  const onColor = color.surface.onColor
  const fadedBorder = semanticResolvers.asFaded({
    themeTokens,
    color: onColor,
  })
  const placeholderColor = semanticResolvers.asDescription({
    themeTokens,
    color: onColor,
  })
  const hoverColor = resolvePressableColoring({
    themeTokens,
    coloring: resolveColoringStyle({
      themeTokens,
      colorPair: themeTokens.color.surface,
      style: 'filled',
    }),
    style: 'filled',
    state: toActivePressableStates({ isHovered: true }),
  }).background

  return {
    trigger: {
      justifyContent: 'center',
      minHeight: layout.size,
      paddingVertical: spacing.md,
      paddingHorizontal: shape.padding.xxl,
      borderRadius: shape.borderRadius.sm,
      borderWidth: borders.borderWidths.thin,
      borderColor: state.isInvalid ? color.negative.color : fadedBorder,
      backgroundColor: state.isDisabled ? color.disabled.color : color.surfaceVariant.color,
      gap: spacing.md,
      opacity: state.isDisabled ? 0.6 : 1,
    },
    triggerText: {
      ...typography.body.md,
      color: placeholderColor,
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
      borderColor: fadedBorder,
      backgroundColor: color.surfaceVariant.color,
      overflow: 'hidden',
    },
    search: {
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: borders.borderWidths.thin,
      borderBottomColor: fadedBorder,
      color: onColor,
    },
    searchPlaceholderColor: placeholderColor,
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: shape.padding.xl,
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      backgroundColor: state.isHighlighted ? hoverColor : 'transparent',
      opacity: state.isDisabled ? 0.5 : 1,
    },
    optionText: {
      ...typography.body.md,
      fontWeight: state.isSelected
        ? typography.fontWeights.semibold
        : typography.fontWeights.base,
      color: state.isSelected ? color.primary.color : onColor,
    },
    checkbox: {
      alignItems: 'center',
      justifyContent: 'center',
      width: checkboxSize,
      height: checkboxSize,
      borderRadius: shape.borderRadius.xs,
      borderWidth: borders.borderWidths.thin,
      borderColor: state.isSelected ? color.primary.color : fadedBorder,
      backgroundColor: state.isSelected ? color.primary.color : 'transparent',
    },
    checkboxIcon: {
      color: color.primary.onColor,
      isVisible: !!state.isSelected,
    },
  }
}
