import type { AvatarOverrideTokens } from '../avatar-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import { type IconTokens } from '../icon-tokens'
import type { PressableOverrideTokens } from '../pressable-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  pillBorderRadius,
  surfaceDescriptionColor
} from './shared'
import {
  stateful,
  tokenCalc,
  tokenPath,
  tokenValue,
  whenState
} from '../builders'

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
  pressableOverrides: PressableOverrideTokens,
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

const conversationAvatarSize = tokenCalc(
  'max',
  tokenCalc(
    'add',
    tokenPath('theme.typography.body.md.lineHeight'),
    tokenCalc(
      'add',
      tokenCalc(
        'max',
        tokenPath('theme.typography.body.sm.lineHeight'),
        tokenPath('theme.icongraphy.sizes.sm')
      ),
      tokenPath('theme.spacing.xs')
    )
  ),
  tokenPath('theme.icongraphy.sizes.lg')
)

export const chatConversationRowTokens = {
  pressableOverrides: {
    overrides: {
      size: 'md',
      coloringStyle: 'foreground',
      coloringColorVariant: 'transparent',
    },
    container: {
      backgroundColor: stateful(
        {
          value: 'transparent',
        },
        [
          whenState(['selected'], tokenPath('theme.color.background.color')),
        ]
      ),
      borderRadius: stateful({
        type: 'all',
        value: tokenValue(0),
      }),
      padding: stateful({
        type: 'physicalAxis',
        vertical: tokenPath('theme.padding.xl'),
        horizontal: tokenPath('theme.spacing.lg'),
      }),
      border: stateful({
        width: {
          type: 'physicalSide',
          left: tokenValue(0),
        },
        color: {
          type: 'physicalSide',
          left: {
            value: 'transparent',
          },
        },
      }, [
        whenState(['selected'], {
          width: {
            type: 'physicalSide',
            left: tokenPath('theme.borderWidth.thick'),
          },
          color: {
            type: 'physicalSide',
            left: tokenPath('theme.color.primary.color'),
          },
        }),
      ]),
      layout: stateful({
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        gap: tokenPath('theme.spacing.md'),
      }),
    },
    stateLayer: {
      borderRadius: stateful({
        type: 'all',
        value: tokenValue(0),
      }),
    },
  },
  contentContainer: {
    layout: stateful({
      direction: 'vertical',
      gap: tokenPath('theme.spacing.xs'),
      flexGrow: tokenValue(1),
    }),
  },
  headerRow: {
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      mainAxisAlignment: 'space-between',
      gap: tokenPath('theme.spacing.md'),
    }),
  },
  messageRow: {
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      flexGrow: tokenValue(1),
      flexShrink: tokenValue(1),
      mainAxisAlignment: 'space-between',
      gap: tokenPath('theme.spacing.sm'),
    }),
  },
  title: {
    fontSize: stateful(tokenPath('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(
      tokenPath('theme.fontWeights.medium'),
      [
        whenState(['unread'], tokenPath('theme.fontWeights.bold')),
      ]
    ),
    color: stateful(tokenPath('theme.color.surface.onColor')),
  },
  timestamp: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(
      tokenPath('theme.fontWeights.base'),
      [
        whenState(['unread'], tokenPath('theme.fontWeights.medium')),
      ]
    ),
    color: stateful(surfaceDescriptionColor),
    flexShrink: stateful(tokenValue(0)),
  },
  preview: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenPath('theme.fontWeights.light')),
    color: stateful(
      surfaceDescriptionColor,
      [
        whenState(['unread'], tokenPath('theme.color.surface.onColor')),
      ]
    ),
  },
  unreadBadge: {
    backgroundColor: stateful(tokenPath('theme.color.primary.color')),
    size: stateful({
      minWidth: tokenPath('theme.icongraphy.sizes.sm'),
      height: tokenPath('theme.icongraphy.sizes.sm'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenValue(pillBorderRadius),
    }),
    padding: stateful({
      type: 'physicalAxis',
      horizontal: tokenPath('theme.padding.md'),
    }),
    layout: stateful({
      flexShrink: tokenValue(0),
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
  },
  unreadBadgeText: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenPath('theme.fontWeights.bold')),
    color: stateful(tokenPath('theme.color.primary.onColor')),
    textAlign: stateful('center'),
  },
  sentIndicator: {
    size: stateful(tokenPath('theme.icongraphy.sizes.xs')),
    strokeWidth: stateful(tokenPath('theme.icongraphy.strokeWidth')),
    color: stateful(surfaceDescriptionColor),
  },
  avatarOverride: {
    container: {
      size: stateful({
        width: conversationAvatarSize,
        height: conversationAvatarSize,
        minWidth: conversationAvatarSize,
        minHeight: conversationAvatarSize,
        maxWidth: conversationAvatarSize,
        maxHeight: conversationAvatarSize,
      }),
      borderRadius: stateful({
        type: 'all',
        value: tokenCalc('divide', conversationAvatarSize, tokenValue(2)),
      }),
    },
    icon: {
      size: stateful(conversationAvatarSize),
    },
  },
} as const
