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
} from './pressable-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export type SelectStateValue =
  | InputStateValue
  | 'open'
  | 'hasValue'
  | 'selected'
  | 'highlighted'

export type SelectState = ReadonlySet<SelectStateValue>

export type SelectComponentResolverProps = {
  config?: {
    hasSearch?: boolean,
  },
  overrides?: {
    color?: ColorPairToken,
  },
  state: SelectState,
}

export type SelectTokens = {
  trigger: ContainerTokens,
  stateLayer: ContainerTokens,
  triggerText: TextStyleTokens,
  icon: IconTokens,
  overlay: ContainerTokens,
  menu: ContainerTokens,
  header: ContainerTokens,
  option: ContainerTokens,
  optionText: TextStyleTokens,
  emptyText: TextStyleTokens,
}

export const selectOverlayColor = HexColorUtils.hexWithAlpha('#000000', 0.35)

export type SelectTokenResolver = ComponentTokenResolver<
  SelectComponentResolverProps,
  SelectTokens
>

export const selectTokenResolver: SelectTokenResolver = ({
  themeTokens,
  semanticResolvers,
  config,
  overrides,
  state,
}) => {
  const { color, spacing, shape, borderWidth, typography } = themeTokens
  const onColor = color.surface.onColor
  const accentPair = overrides?.color ?? color.primary
  const hasSearch = config?.hasSearch ?? true
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
      themeTokens,
      coloring: resolveColoringColorVariant({
        themeTokens,
        colorPair: themeTokens.color.surface,
        variant: 'normal',
      }),
      style: 'filled',
    }),
    variant: 'filled',
    state: new Set<PressableStateValue>(['hovered']),
  }).background
  const touchTargetSize = semanticResolvers.touchTargetSize({ themeTokens })
  const menuHeight = touchTargetSize * 6
  const inputPadding = input.container.padding
  const horizontalPadding = inputPadding?.type === 'physicalAxis'
    ? inputPadding.horizontal
    : undefined

  return {
    trigger: {
      ...input.container,
      layout: {
        ...input.container.layout,
        gap: horizontalPadding,
      },
    },
    stateLayer: {
      backgroundColor: tint,
    },
    triggerText: state.has('hasValue') ? input.text : input.placeholder,
    icon: input.icon,
    overlay: {
      backgroundColor: selectOverlayColor,
      padding: {
        type: 'physicalAxis',
        vertical: spacing.xl,
        horizontal: spacing.xl,
      },
      layout: {
        direction: 'vertical',
        mainAxisAlignment: 'center',
      },
    },
    menu: {
      backgroundColor: color.surfaceVariant.color,
      overflow: 'hidden',
      size:  hasSearch ? {
        minHeight: menuHeight,
        height: menuHeight,
      } : {
        maxHeight: menuHeight,
      },
      shape: {
        borderRadius: { type: 'all', value: shape.borderRadius.lg },
      },
      border: {
        width: {
          type: 'all',
          value: borderWidth.thin,
        },
        color: {
          type: 'all',
          value: fadedBorder,
        },
      },
    },
    header: {
      padding: {
        type: 'physicalAxis',
        vertical: shape.padding.sm,
        horizontal: shape.padding.sm,
      },
    },
    option: {
      backgroundColor: state.has('highlighted') ? hoverColor : 'transparent',
      opacity: state.has('disabled') ? 0.5 : 1,
      padding: {
        type: 'physicalAxis',
        vertical: shape.padding.xl,
        horizontal: spacing.lg,
      },
    },
    optionText: {
      ...typography.body.md,
      fontWeight: state.has('selected')
        ? typography.fontWeights.semibold
        : typography.fontWeights.base,
      color: state.has('selected') ? accentPair.color : color.surface.onColor,
    },
    emptyText: {
      ...typography.body.md,
      color: semanticResolvers.asDescription({
        themeTokens,
        color: onColor,
      }),
    },
  }
}
