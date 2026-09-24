import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ContainerTokens } from '../../container-tokens'
import type { TextTokens } from '../../text-tokens'
import type { PressableOverrideTokens } from '../pressable-tokens'
import type { AvatarOverrideTokens } from '../avatar-tokens'
import { surfaceDescriptionColor, surfaceFadedColor } from './shared'

export type ChatThreadHeaderState = ResolverState
export type ChatThreadHeaderConfig = HightideResolverConfig

export type ChatThreadHeaderTokens = AssertAssignable<{
  container: ContainerTokens,
  contentRow: ContainerTokens,
  title: TextTokens,
  subtitle: TextTokens,
}, ComponentTokens<ChatThreadHeaderConfig>> & {
  avatarOverride: AvatarOverrideTokens,
  pressableOverwrites: PressableOverrideTokens,
}

export type ChatThreadHeaderTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatThreadHeaderTokens
>

const threadAvatarSize = TokenBuilder.calc(
  'max',
  TokenBuilder.calc(
    'add',
    TokenBuilder.numberRef('theme.typography.body.md.lineHeight'),
    TokenBuilder.calc(
      'add',
      TokenBuilder.numberRef('theme.typography.body.sm.lineHeight'),
      TokenBuilder.numberRef('theme.spacing.xs')
    )
  ),
  TokenBuilder.numberRef('theme.icongraphy.sizes.lg')
)

export const chatThreadHeaderTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.surface.color')),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.padding.sm'), horizontal: TokenBuilder.numberRef('theme.padding.md') }),
    border: TokenBuilder.stateful({
      width: TokenBuilder.sides({ bottom: TokenBuilder.numberRef('theme.borderWidth.thin') }),
      color: TokenBuilder.sides({ bottom: surfaceFadedColor }),
    }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
      gap: TokenBuilder.numberRef('theme.spacing.xs'),
    }),
  },
  contentRow: {
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('vertical'),
      gap: TokenBuilder.numberRef('theme.spacing.xs'),
      flexGrow: TokenBuilder.numberValue(TokenBuilder.number(1)),
    }),
  },
  title: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.bold')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.surface.onColor')),
  },
  subtitle: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.light')),
    color: TokenBuilder.stateful(surfaceDescriptionColor),
  },
  avatarOverride: {
    container: {
      type: 'container',
      size: TokenBuilder.stateful({
        width: threadAvatarSize,
        height: threadAvatarSize,
        minWidth: threadAvatarSize,
        minHeight: threadAvatarSize,
        maxWidth: threadAvatarSize,
        maxHeight: threadAvatarSize,
      }),
      borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.calc('divide', threadAvatarSize, TokenBuilder.numberValue(TokenBuilder.number(2))) }),
    },
    icon: {
      type: 'icon',
      size: TokenBuilder.stateful(threadAvatarSize),
    },
  },
  pressableOverwrites: {
    overrides: {
      size: 'md',
      coloringStyle: 'foreground',
      coloringColorVariant: 'transparent',
    },
    container: {
      type: 'container',
      size: TokenBuilder.stateful({
        minHeight: TokenBuilder.numberValue(TokenBuilder.number(0)),
      }),
      padding: TokenBuilder.padding({ value: TokenBuilder.numberRef('theme.padding.md') }),
      layout: TokenBuilder.stateful({
        direction: TokenBuilder.layoutDirection('horizontal'),
        crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
        gap: TokenBuilder.numberRef('theme.spacing.md'),
        flexGrow: TokenBuilder.numberValue(TokenBuilder.number(1)),
      }),
    },
  },
} as const
