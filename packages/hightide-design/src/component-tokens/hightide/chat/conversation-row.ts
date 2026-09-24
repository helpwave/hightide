import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import { TokenBuilder } from '../../../utils'
import type { NumberValueToken } from '../../../primitive-tokens/number-value-token'
import type { ColorValueToken } from '../../../primitive-tokens/color-value-token'
import type { TokenRef, TokenRefOrValue } from '../../../utils/token-type'
import type { AvatarOverrideTokens } from '../avatar-tokens'
import { HexColorUtils } from '../../../utils/hex'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ContainerTokens } from '../../container-tokens'
import type { IconTokens } from '../../icon-tokens'
import type { TextTokens } from '../../text-tokens'
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
  contentContainer: ContainerTokens,
  headerRow: ContainerTokens,
  messageRow: ContainerTokens,
  title: TextTokens,
  timestamp: TextTokens,
  preview: TextTokens,
  unreadBadge: ContainerTokens,
  unreadBadgeText: TextTokens,
  sentIndicator: IconTokens,
}, ComponentTokens<ChatConversationRowConfig>> & {
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
    type: 'container',
      backgroundColor: TokenBuilder.stateful(
        TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
        [
          TokenBuilder.whenState(['selected'], TokenBuilder.colorValueRef('theme.color.background.color')),
        ]
      ),
      borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberValue(TokenBuilder.number(0)) }),
      padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.padding.xl'), horizontal: TokenBuilder.numberRef('theme.spacing.lg') }),
      border: TokenBuilder.stateful({
        width: TokenBuilder.sides<TokenRefOrValue<NumberValueToken>>({ left: TokenBuilder.numberValue(TokenBuilder.number(0)) }),
        color: TokenBuilder.sides<TokenRefOrValue<ColorValueToken>>({ left: TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)) }),
      }, [
        TokenBuilder.whenState(['selected'], {
          width: TokenBuilder.sides<TokenRefOrValue<NumberValueToken>>({ left: TokenBuilder.numberRef('theme.borderWidth.thick') }),
          color: TokenBuilder.sides<TokenRefOrValue<ColorValueToken>>({ left: TokenBuilder.colorValueRef('theme.color.primary.color') }),
        }),
      ]),
      layout: TokenBuilder.stateful({
        direction: TokenBuilder.layoutDirection('horizontal'),
        crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
        gap: TokenBuilder.numberRef('theme.spacing.md'),
      }),
    },
    stateLayer: {
    type: 'container',
      borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberValue(TokenBuilder.number(0)) }),
    },
  },
  contentContainer: {
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('vertical'),
      gap: TokenBuilder.numberRef('theme.spacing.xs'),
      flexGrow: TokenBuilder.numberValue(TokenBuilder.number(1)),
    }),
  },
  headerRow: {
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('space-between'),
      gap: TokenBuilder.numberRef('theme.spacing.md'),
    }),
  },
  messageRow: {
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
      flexGrow: TokenBuilder.numberValue(TokenBuilder.number(1)),
      flexShrink: TokenBuilder.numberValue(TokenBuilder.number(1)),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('space-between'),
      gap: TokenBuilder.numberRef('theme.spacing.sm'),
    }),
  },
  title: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(
      TokenBuilder.numberRef('theme.fontWeights.medium'),
      [
        TokenBuilder.whenState(['unread'], TokenBuilder.numberRef('theme.fontWeights.bold')),
      ]
    ),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.surface.onColor')),
  },
  timestamp: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(
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
        TokenBuilder.whenState(['unread'], TokenBuilder.colorValueRef('theme.color.surface.onColor')),
      ]
    ),
  },
  unreadBadge: {
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.primary.color')),
    size: TokenBuilder.stateful({
      minWidth: TokenBuilder.numberRef('theme.icongraphy.sizes.sm'),
      height: TokenBuilder.numberRef('theme.icongraphy.sizes.sm'),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberValue(TokenBuilder.number(pillBorderRadius)) }),
    padding: TokenBuilder.padding({ horizontal: TokenBuilder.numberRef('theme.padding.md') }),
    layout: TokenBuilder.stateful({
      flexShrink: TokenBuilder.numberValue(TokenBuilder.number(0)),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('center'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
  },
  unreadBadgeText: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.bold')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.primary.onColor')),
    textAlign: TokenBuilder.stateful('center'),
  },
  sentIndicator: {
    size: TokenBuilder.stateful(TokenBuilder.numberRef('theme.icongraphy.sizes.xs')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef('theme.icongraphy.strokeWidth')),
    color: TokenBuilder.stateful(surfaceDescriptionColor),
  },
  avatarOverride: {
    container: {
    type: 'container',
      size: TokenBuilder.stateful({
        width: conversationAvatarSize,
        height: conversationAvatarSize,
        minWidth: conversationAvatarSize,
        minHeight: conversationAvatarSize,
        maxWidth: conversationAvatarSize,
        maxHeight: conversationAvatarSize,
      }),
      borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.calc('divide', conversationAvatarSize, TokenBuilder.numberValue(TokenBuilder.number(2))) }),
    },
    icon: {
    type: 'icon',
      size: TokenBuilder.stateful(conversationAvatarSize),
    },
  },
} as const
