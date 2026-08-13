import { resolvePressableStateLayerTint } from '../../semantic-token-resolvers'
import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { PressableStateValue } from '../pressable-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  pillBorderRadius,
  resolveDescriptionColor
} from './shared'

export type ChatConversationRowState = {
  isPressed?: boolean,
  isHovered?: boolean,
  isFocused?: boolean,
  isFocusVisible?: boolean,
  isDisabled?: boolean,
  isUnread?: boolean,
  isSelected?: boolean,
}

export type ChatConversationRowComponentResolverProps = {
  state: ChatConversationRowState,
}

export type ChatConversationRowTokens = {
  container: ContainerTokens,
  title: TextStyleTokens,
  timestamp: TextStyleTokens,
  preview: TextStyleTokens,
  unreadBadge: ContainerTokens,
  unreadBadgeText: TextStyleTokens,
  sentIndicator: IconTokens,
}

export type ChatConversationRowTokenResolver = ComponentTokenResolver<
  ChatConversationRowComponentResolverProps,
  ChatConversationRowTokens
>

const toPressableStates = (state: ChatConversationRowState): ReadonlySet<PressableStateValue> => {
  const active = new Set<PressableStateValue>()

  if (state.isDisabled) {
    active.add('disabled')
  }
  if (state.isFocused) {
    active.add('focused')
  }
  if (state.isFocusVisible) {
    active.add('focusVisible')
  }
  if (state.isHovered) {
    active.add('hovered')
  }
  if (state.isPressed) {
    active.add('pressed')
  }

  return active
}

export const chatConversationRowTokenResolver: ChatConversationRowTokenResolver = ({ themeTokens, semanticResolvers, state }) => {
  const { color, spacing, shape, borders, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const baseBackground = state.isSelected ? color.background.color : 'transparent'
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: toPressableStates(state),
    color: color.surface.onColor,
  })
  const backgroundColor = HexColorUtils.blend(
    baseBackground === 'transparent' ? '#FFFFFF00' : baseBackground,
    tint === 'transparent' ? '#FFFFFF00' : tint
  )

  return {
    container: {
      backgroundColor,
      size: {
        width: '100%',
      },
      shape: {
        borderRadius: { type: 'all', value: shape.borderRadius.sm },
      },
      padding: {
        type: 'physicalAxis',
        vertical: shape.padding.xxl,
        horizontal: spacing.lg,
      },
      border: {
        width: {
          type: 'physicalSide',
          left: state.isSelected ? borders.borderWidths.thick : 0,
        },
        color: {
          type: 'physicalSide',
          left: state.isSelected ? color.primary.color : 'transparent',
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap: shape.padding.xxl,
      },
    },
    title: {
      ...typography.body.md,
      fontWeight: state.isUnread ? typography.fontWeights.bold : typography.fontWeights.medium,
      color: color.surface.onColor,
      flex: 1,
    },
    timestamp: {
      ...typography.body.sm,
      fontWeight: state.isUnread ? typography.fontWeights.medium : typography.fontWeights.base,
      color: state.isUnread ? color.primary.color : descriptionColor,
      flexShrink: 0,
    },
    preview: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.light,
      color: state.isUnread ? color.surface.onColor : descriptionColor,
      flex: 1,
    },
    unreadBadge: {
      backgroundColor: color.primary.color,
      size: {
        minWidth: spacing.lg + spacing.sm,
        height: spacing.lg + spacing.sm,
      },
      shape: {
        borderRadius: { type: 'all', value: pillBorderRadius },
      },
      padding: {
        type: 'physicalAxis',
        horizontal: shape.padding.md,
      },
      layout: {
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    unreadBadgeText: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.bold,
      color: color.primary.onColor,
    },
    sentIndicator: {
      color: color.primary.color,
    },
  }
}
