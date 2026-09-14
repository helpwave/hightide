import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import { TokenBuilder } from '../../../utils'
import type { NumberToken } from '../../../primitive-tokens/number-token'
import type { ColorValueToken } from '../../../primitive-tokens/color-value-token'
import type { TokenRef } from '../../../utils/token-type'
import type { AvatarOverrideTokens } from '../avatar-tokens'
import { HexColorUtils } from '../../../utils/hex'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../../resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from '../../resolvable-text-style-tokens'
import type { PressableOverrideTokens } from '../pressable-tokens'
import {
  pillBorderRadius,
  surfaceDescriptionColor
} from './shared'

export type ChatConversationRowResolveState = {
  isPressed?: boolean,
  isHovered?: boolean,
  isFocused?: boolean,
  isFocusVisible?: boolean,
  isDisabled?: boolean,
  isUnread?: boolean,
  isSelected?: boolean,
}

export type ChatConversationRowState = AssertAssignable<'unread' | 'selected', ResolverState>
export type ChatConversationRowConfig = HightideResolverConfig

export type ChatConversationRowComponentResolverProps = {
  state: ChatConversationRowResolveState,
}

export type ChatConversationRowTokens = AssertAssignable<{
  contentContainer: ResolvableContainerTokens<ChatConversationRowState, ChatConversationRowConfig>,
  headerRow: ResolvableContainerTokens<ChatConversationRowState, ChatConversationRowConfig>,
  messageRow: ResolvableContainerTokens<ChatConversationRowState, ChatConversationRowConfig>,
  title: ResolvableTextStyleTokens<ChatConversationRowState, ChatConversationRowConfig>,
  timestamp: ResolvableTextStyleTokens<ChatConversationRowState, ChatConversationRowConfig>,
  preview: ResolvableTextStyleTokens<ChatConversationRowState, ChatConversationRowConfig>,
  unreadBadge: ResolvableContainerTokens<ChatConversationRowState, ChatConversationRowConfig>,
  unreadBadgeText: ResolvableTextStyleTokens<ChatConversationRowState, ChatConversationRowConfig>,
  sentIndicator: ResolvableIconTokens<ChatConversationRowState, ChatConversationRowConfig>,
}, ComponentTokens<ChatConversationRowState, ChatConversationRowConfig>> & {
  pressableOverrides: PressableOverrideTokens,
  avatarOverride: AvatarOverrideTokens,
}

export type ChatConversationRowTokenResolver = ComponentTokenResolver<
  ChatConversationRowComponentResolverProps,
  ChatConversationRowTokens
>

const conversationAvatarSize = TokenBuilder.calc(
  'max',
  TokenBuilder.calc(
    'add',
    TokenBuilder.numberRef('theme.typography.body.md.lineHeight'),
    TokenBuilder.calc(
      'add',
      TokenBuilder.calc(
        'max',
        TokenBuilder.numberRef('theme.typography.body.sm.lineHeight'),
        TokenBuilder.numberRef('theme.icongraphy.sizes.sm')
      ),
      TokenBuilder.numberRef('theme.spacing.xs')
    )
  ),
  TokenBuilder.numberRef('theme.icongraphy.sizes.lg')
)

export const chatConversationRowTokens = {
  pressableOverrides: {
    overrides: {
      size: 'md',
      coloringStyle: 'foreground',
      coloringColorVariant: 'transparent',
    },
    container: {
    kind: 'container' as const,
      backgroundColor: TokenBuilder.stateful(
        TokenBuilder.color(HexColorUtils.transparent),
        [
          TokenBuilder.whenState(['selected'], TokenBuilder.colorRef('theme.color.background.color')),
        ]
      ),
      borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.number(0) }),
      padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.padding.xl'), horizontal: TokenBuilder.numberRef('theme.spacing.lg') }),
      border: TokenBuilder.stateful({
        width: TokenBuilder.sides({ left: TokenBuilder.number(0) }),
        color: TokenBuilder.sides({ left: TokenBuilder.color(HexColorUtils.transparent) }),
      }, [
        TokenBuilder.whenState(['selected'], {
          width: TokenBuilder.sides({ left: TokenBuilder.numberRef('theme.borderWidth.thick') }),
          color: TokenBuilder.sides({ left: TokenBuilder.colorRef('theme.color.primary.color') }),
        }),
      ]),
      layout: TokenBuilder.stateful({
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        gap: TokenBuilder.numberRef('theme.spacing.md'),
      }),
    },
    stateLayer: {
    kind: 'container' as const,
      borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.number(0) }),
    },
  },
  contentContainer: {
    layout: TokenBuilder.stateful({
      direction: 'vertical',
      gap: TokenBuilder.numberRef('theme.spacing.xs'),
      flexGrow: TokenBuilder.number(1),
    }),
  },
  headerRow: {
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      mainAxisAlignment: 'space-between',
      gap: TokenBuilder.numberRef('theme.spacing.md'),
    }),
  },
  messageRow: {
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      flexGrow: TokenBuilder.number(1),
      flexShrink: TokenBuilder.number(1),
      mainAxisAlignment: 'space-between',
      gap: TokenBuilder.numberRef('theme.spacing.sm'),
    }),
  },
  title: {
    kind: 'textStyle' as const,
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.statefulField<NumberToken>(
      TokenBuilder.numberRef('theme.fontWeights.medium'),
      [
        TokenBuilder.whenState(['unread'], TokenBuilder.numberRef('theme.fontWeights.bold')),
      ]
    ),
    color: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.surface.onColor')),
  },
  timestamp: {
    kind: 'textStyle' as const,
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.statefulField<NumberToken>(
      TokenBuilder.numberRef('theme.fontWeights.base'),
      [
        TokenBuilder.whenState(['unread'], TokenBuilder.numberRef('theme.fontWeights.medium')),
      ]
    ),
    color: TokenBuilder.stateful(surfaceDescriptionColor),
  },
  preview: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.light')),
    color: TokenBuilder.stateful<ColorValueToken | TokenRef<ColorValueToken>>(
      surfaceDescriptionColor,
      [
        TokenBuilder.whenState(['unread'], TokenBuilder.colorRef('theme.color.surface.onColor')),
      ]
    ),
  },
  unreadBadge: {
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.primary.color')),
    size: TokenBuilder.stateful({
      minWidth: TokenBuilder.numberRef('theme.icongraphy.sizes.sm'),
      height: TokenBuilder.numberRef('theme.icongraphy.sizes.sm'),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.number(pillBorderRadius) }),
    padding: TokenBuilder.padding({ horizontal: TokenBuilder.numberRef('theme.padding.md') }),
    layout: TokenBuilder.stateful({
      flexShrink: TokenBuilder.number(0),
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
  },
  unreadBadgeText: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.bold')),
    color: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.primary.onColor')),
    textAlign: TokenBuilder.stateful('center'),
  },
  sentIndicator: {
    size: TokenBuilder.stateful(TokenBuilder.numberRef('theme.icongraphy.sizes.xs')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef('theme.icongraphy.strokeWidth')),
    color: TokenBuilder.stateful(surfaceDescriptionColor),
  },
  avatarOverride: {
    container: {
    kind: 'container' as const,
      size: TokenBuilder.stateful({
        width: conversationAvatarSize,
        height: conversationAvatarSize,
        minWidth: conversationAvatarSize,
        minHeight: conversationAvatarSize,
        maxWidth: conversationAvatarSize,
        maxHeight: conversationAvatarSize,
      }),
      borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.calc('divide', conversationAvatarSize, TokenBuilder.number(2)) }),
    },
    icon: {
    kind: 'icon' as const,
      size: TokenBuilder.stateful(conversationAvatarSize),
    },
  },
} as const
