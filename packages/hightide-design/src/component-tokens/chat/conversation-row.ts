import type { AvatarOverrideTokens } from '../avatar-tokens'
import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { ComponentTokenConfig, ComponentTokenConfigValue } from '../token-config'
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
  tokenVariable,
  tokenValue,
  whenState,
  statefulField
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
    tokenVariable('theme.typography.body.md.lineHeight'),
    tokenCalc(
      'add',
      tokenCalc(
        'max',
        tokenVariable('theme.typography.body.sm.lineHeight'),
        tokenVariable('theme.icongraphy.sizes.sm')
      ),
      tokenVariable('theme.spacing.xs')
    )
  ),
  tokenVariable('theme.icongraphy.sizes.lg')
)

export const chatConversationRowTokens = {
  pressableOverrides: {
    overrides: {
      size: 'md',
      coloringStyle: 'foreground',
      coloringColorVariant: 'transparent',
    },
    container: {
      backgroundColor: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['backgroundColor']>>>(
        {
          value: HexColorUtils.transparent,
        },
        [
          whenState(['selected'], tokenVariable('theme.color.background.color')),
        ]
      ),
      borderRadius: stateful({
        type: 'all',
        value: tokenValue(0),
      }),
      padding: stateful({
        type: 'physicalAxis',
        vertical: tokenVariable('theme.padding.xl'),
        horizontal: tokenVariable('theme.spacing.lg'),
      }),
      border: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['border']>>>({
        width: {
          type: 'physicalSide',
          left: tokenValue(0),
        },
        color: {
          type: 'physicalSide',
          left: {
            value: HexColorUtils.transparent,
          },
        },
      }, [
        whenState(['selected'], {
          width: {
            type: 'physicalSide',
            left: tokenVariable('theme.borderWidth.thick'),
          },
          color: {
            type: 'physicalSide',
            left: tokenVariable('theme.color.primary.color'),
          },
        }),
      ]),
      layout: stateful({
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        gap: tokenVariable('theme.spacing.md'),
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
      gap: tokenVariable('theme.spacing.xs'),
      flexGrow: tokenValue(1),
    }),
  },
  headerRow: {
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      mainAxisAlignment: 'space-between',
      gap: tokenVariable('theme.spacing.md'),
    }),
  },
  messageRow: {
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      flexGrow: tokenValue(1),
      flexShrink: tokenValue(1),
      mainAxisAlignment: 'space-between',
      gap: tokenVariable('theme.spacing.sm'),
    }),
  },
  title: {
    fontSize: stateful(tokenVariable('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.md.lineHeight')),
    fontWeight: statefulField<number>(
      tokenVariable('theme.fontWeights.medium'),
      [
        whenState(['unread'], tokenVariable('theme.fontWeights.bold')),
      ]
    ),
    color: stateful(tokenVariable('theme.color.surface.onColor')),
  },
  timestamp: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: statefulField<number>(
      tokenVariable('theme.fontWeights.base'),
      [
        whenState(['unread'], tokenVariable('theme.fontWeights.medium')),
      ]
    ),
    color: stateful(surfaceDescriptionColor),
  },
  preview: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.light')),
    color: stateful(
      surfaceDescriptionColor,
      [
        whenState(['unread'], tokenVariable('theme.color.surface.onColor')),
      ]
    ),
  },
  unreadBadge: {
    backgroundColor: stateful(tokenVariable('theme.color.primary.color')),
    size: stateful({
      minWidth: tokenVariable('theme.icongraphy.sizes.sm'),
      height: tokenVariable('theme.icongraphy.sizes.sm'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenValue(pillBorderRadius),
    }),
    padding: stateful({
      type: 'physicalAxis',
      horizontal: tokenVariable('theme.padding.md'),
    }),
    layout: stateful({
      flexShrink: tokenValue(0),
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
  },
  unreadBadgeText: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.bold')),
    color: stateful(tokenVariable('theme.color.primary.onColor')),
    textAlign: stateful('center'),
  },
  sentIndicator: {
    size: stateful(tokenVariable('theme.icongraphy.sizes.xs')),
    strokeWidth: stateful(tokenVariable('theme.icongraphy.strokeWidth')),
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
} as const satisfies ComponentTokenConfig<ChatConversationRowTokens>
