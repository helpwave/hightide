import { resolvePressableStateLayerTint } from '../../semantic-token-resolvers'
import { HexColorUtils } from '../../utils/hex'
import type { AvatarOverrideTokens } from '../avatar-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import { type IconTokens } from '../icon-tokens'
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
  contentContainer: ContainerTokens,
  headerRow: ContainerTokens,
  messageRow: ContainerTokens,
  title: TextStyleTokens,
  timestamp: TextStyleTokens,
  preview: TextStyleTokens,
  unreadBadge: ContainerTokens,
  unreadBadgeText: TextStyleTokens,
  sentIndicator: IconTokens,
  avatarOverride: AvatarOverrideTokens,
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
  const { color, spacing, shape, borderWidth, typography } = themeTokens
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
  const title: TextStyleTokens = {
    ...typography.body.md,
    fontWeight: state.isUnread ? typography.fontWeights.bold : typography.fontWeights.medium,
    color: color.surface.onColor,
  }
  const preview: TextStyleTokens = {
    ...typography.body.sm,
    fontWeight: typography.fontWeights.light,
    color: state.isUnread ? color.surface.onColor : descriptionColor,
  }
  const contentContainer: ContainerTokens = {
    layout: {
      direction: 'vertical',
      gap: spacing.xs,
      flexGrow: 1,
    },
  }
  const avatarSize = (title.lineHeight ?? 0)
    + (preview.lineHeight ?? 0)
    + (contentContainer.layout?.gap ?? 0)

  return {
    container: {
      backgroundColor,
      shape: {
        borderRadius: { type: 'all', value: shape.borderRadius.sm },
      },
      padding: {
        type: 'physicalAxis',
        vertical: shape.padding.xl,
        horizontal: spacing.lg,
      },
      border: {
        width: {
          type: 'physicalSide',
          left: state.isSelected ? borderWidth.thick : 0,
        },
        color: {
          type: 'physicalSide',
          left: state.isSelected ? color.primary.color : 'transparent',
        },
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        selfCrossAxisAlignment: 'stretch',
        gap: shape.padding.xl,
      },
    },
    contentContainer,
    headerRow: {
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        mainAxisAlignment: 'space-between',
        gap: spacing.md,
      },
    },
    messageRow: {
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        flexGrow: 1,
        mainAxisAlignment: 'space-between',
        gap: spacing.sm,
      },
    },
    title,
    timestamp: {
      ...typography.body.sm,
      fontWeight: state.isUnread ? typography.fontWeights.medium : typography.fontWeights.base,
      color: descriptionColor,
      flexShrink: 0,
    },
    preview,
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
      size: themeTokens.icongraphy.sizes.xs,
      strokeWidth: themeTokens.icongraphy.strokeWidth,
      color: color.primary.color,
    },
    avatarOverride: {
      container: {
        size: {
          width: avatarSize,
          height: avatarSize,
          minWidth: avatarSize,
          minHeight: avatarSize,
          maxWidth: avatarSize,
          maxHeight: avatarSize,
        },
        shape: {
          borderRadius: { type: 'all', value: avatarSize / 2 },
        },
      },
      icon: {
        size: avatarSize,
      },
    },
  }
}
