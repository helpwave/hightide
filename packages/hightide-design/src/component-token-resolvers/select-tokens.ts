import type { ColorToken } from '../primitive-tokens/color'
import { createElementLayoutTokens } from '../theme-tokens/element-layout'
import { HexColorUtils } from '../utils/hex'
import { resolveColorPairColoring } from './coloring'
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

export type SelectComponentResolverProps = {
  state: SelectState,
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

export type SelectTokens = {
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

export type SelectTokenResolver = ComponentTokenResolver<
  SelectComponentResolverProps,
  SelectTokens
>

export const selectTokenResolver: SelectTokenResolver = ({ themeTokens, semanticResolvers, state }) => {
  const { color, spacing, shape, borders, typography } = themeTokens
  const layout = createElementLayoutTokens(themeTokens).control.md
  const onColor = color.surface.onColor
  const fadedBorder = semanticResolvers.asFaded({
    themeTokens,
    semanticResolvers,
    color: onColor,
  })
  const placeholderColor = semanticResolvers.asDescription({
    themeTokens,
    semanticResolvers,
    color: onColor,
  })
  const hoverColor = resolveColorPairColoring({
    themeTokens,
    semanticResolvers,
    colorPair: themeTokens.color.surface,
    style: 'filled',
    state: { isHovered: true },
  }).color

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
      opacity: state.isDisabled ? 0.6 : 1,
    },
    triggerText: {
      ...typography.body.md,
      color: state.hasValue ? onColor : placeholderColor,
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
      color: state.isSelected ? color.primary.color : color.surface.onColor,
    },
  }
}
