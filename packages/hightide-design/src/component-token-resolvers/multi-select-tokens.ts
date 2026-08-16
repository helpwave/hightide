import {
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import {
  inputStateValues,
  inputTokenResolver,
  toInputState
} from './input-tokens'
import {
  toPressableState,
  type PressableStateValue
} from './pressable-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import { selectOverlayColor } from './select-tokens'

export const multiSelectStateValues = [
  ...inputStateValues,
  'open',
  'hasSelections',
  'selected',
  'highlighted',
] as const

export type MultiSelectStateValue = typeof multiSelectStateValues[number]

export type MultiSelectState = ReadonlySet<MultiSelectStateValue>

export const multiSelectStateValueSet: ReadonlySet<MultiSelectStateValue> = new Set(multiSelectStateValues)

export type MultiSelectComponentResolverProps = {
  config?: {
    hasSearch?: boolean,
  },
  overrides?: {
    color?: ColorPairToken,
  },
  state: MultiSelectState,
}

export type MultiSelectTokens = {
  trigger: ContainerTokens,
  stateLayer: ContainerTokens,
  triggerText: TextStyleTokens,
  overlay: ContainerTokens,
  menu: ContainerTokens,
  header: ContainerTokens,
  option: ContainerTokens,
  optionText: TextStyleTokens,
  emptyText: TextStyleTokens,
  checkbox: ContainerTokens,
  checkboxIcon: IconTokens,
}

export type MultiSelectTokenResolver = ComponentTokenResolver<
  MultiSelectComponentResolverProps,
  MultiSelectTokens
>

export const multiSelectTokenResolver: MultiSelectTokenResolver = ({
  themeTokens,
  semanticResolvers,
  config,
  overrides,
  state,
}) => {
  const { color, spacing, shape, borderWidth, typography } = themeTokens
  const checkboxSize = spacing.lg + spacing.xs
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

  return {
    trigger: {
      ...input.container,
      size: {
        ...input.container.size,
        width: '100%',
      },
    },
    stateLayer: {
      backgroundColor: tint,
    },
    triggerText: state.has('hasSelections') ? input.text : input.placeholder,
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
      size: hasSearch ? {
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
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap: shape.padding.xl,
      },
    },
    optionText: {
      ...typography.body.md,
      fontWeight: state.has('selected')
        ? typography.fontWeights.semibold
        : typography.fontWeights.base,
      color: state.has('selected') ? accentPair.color : onColor,
    },
    emptyText: {
      ...typography.body.md,
      color: semanticResolvers.asDescription({
        themeTokens,
        color: onColor,
      }),
    },
    checkbox: {
      backgroundColor: state.has('selected') ? accentPair.color : 'transparent',
      size: {
        width: checkboxSize,
        height: checkboxSize,
      },
      shape: {
        borderRadius: { type: 'all', value: shape.borderRadius.xs },
      },
      border: {
        width: {
          type: 'all',
          value: borderWidth.thin,
        },
        color: {
          type: 'all',
          value: state.has('selected') ? accentPair.color : fadedBorder,
        },
      },
      layout: {
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    checkboxIcon: {
      color: accentPair.onColor,
    },
  }
}
