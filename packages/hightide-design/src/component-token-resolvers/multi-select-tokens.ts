import type { ColorToken } from '../primitive-tokens/color'
import {
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import {
  inputTokenResolver,
  type InputState
} from './input-tokens'
import { toActivePressableStates } from './pressable'
import type { TextStyleTokens } from './text-style-tokens'
import type {
  SelectMenuTokens,
  SelectOverlayTokens,
  SelectSearchTokens,
  SelectTriggerTokens
} from './select-tokens'
import { selectOverlayColor } from './select-tokens'

export type MultiSelectState = InputState & {
  isOpen?: boolean,
  hasSelections?: boolean,
  isSelected?: boolean,
  isHighlighted?: boolean,
}

export type MultiSelectComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: MultiSelectState,
}

export type MultiSelectTriggerTokens = SelectTriggerTokens

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

export const multiSelectTokenResolver: MultiSelectTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const { color, spacing, shape, borders, typography } = themeTokens
  const checkboxSize = spacing.lg + spacing.xs
  const onColor = color.surface.onColor
  const accentPair = overrides?.color ?? color.primary
  const fadedBorder = semanticResolvers.asFaded({
    themeTokens,
    color: onColor,
  })
  const input = inputTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: {
      color: overrides?.color,
    },
    state,
  })
  const hoverColor = resolvePressableColoring({
    themeTokens,
    coloring: resolveColoringStyle({
      coloring: resolveColoringColorVariant({
        colorPair: themeTokens.color.surface,
        variant: 'normal',
      }),
      style: 'filled',
    }),
    variant: 'filled',
    state: toActivePressableStates({ isHovered: true }),
  }).background

  return {
    trigger: {
      ...input.container,
      size: {
        ...input.container.size,
        width: '100%',
      },
    },
    triggerText: state.hasSelections ? input.text : input.placeholder,
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
    searchPlaceholderColor: input.placeholder.color ?? onColor,
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
      color: state.isSelected ? accentPair.color : onColor,
    },
    checkbox: {
      alignItems: 'center',
      justifyContent: 'center',
      width: checkboxSize,
      height: checkboxSize,
      borderRadius: shape.borderRadius.xs,
      borderWidth: borders.borderWidths.thin,
      borderColor: state.isSelected ? accentPair.color : fadedBorder,
      backgroundColor: state.isSelected ? accentPair.color : 'transparent',
    },
    checkboxIcon: {
      color: accentPair.onColor,
      isVisible: !!state.isSelected,
    },
  }
}
