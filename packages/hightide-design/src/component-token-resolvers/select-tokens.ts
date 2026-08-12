import type { ColorToken } from '../primitive-tokens/color'
import {
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import {
  inputTokenResolver,
  toInputState,
  type InputStateValue
} from './input-tokens'
import {
  toPressableState,
  type PressableStateValue
} from './pressable'
import type { TextStyleTokens } from './text-style-tokens'

export type SelectStateValue =
  | InputStateValue
  | 'open'
  | 'hasValue'
  | 'selected'
  | 'highlighted'

export type SelectState = ReadonlySet<SelectStateValue>

export type SelectComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: SelectState,
}

export type SelectTriggerTokens = ContainerTokens

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
  stateLayer: ContainerTokens,
  triggerText: TextStyleTokens,
  icon: IconTokens,
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

export const selectTokenResolver: SelectTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const { color, spacing, shape, borders, typography } = themeTokens
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
    state: toInputState(state),
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: toPressableState(state),
    color: input.text.color ?? onColor,
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
    state: new Set<PressableStateValue>(['hovered']),
  }).background

  return {
    trigger: {
      ...input.container,
      layout: {
        ...input.container.layout,
        gap: input.container.shape?.padding?.horizontal,
      },
    },
    stateLayer: {
      backgroundColor: tint,
    },
    triggerText: state.has('hasValue') ? input.text : input.placeholder,
    icon: input.icon,
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
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      backgroundColor: state.has('highlighted') ? hoverColor : 'transparent',
      opacity: state.has('disabled') ? 0.5 : 1,
    },
    optionText: {
      ...typography.body.md,
      fontWeight: state.has('selected')
        ? typography.fontWeights.semibold
        : typography.fontWeights.base,
      color: state.has('selected') ? accentPair.color : color.surface.onColor,
    },
  }
}
