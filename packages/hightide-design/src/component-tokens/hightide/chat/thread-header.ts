import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'
import type { ResolvableTextStyleTokens } from '../../resolvable-text-style-tokens'
import type { PressableOverrideTokens } from '../pressable-tokens'
import type { AvatarOverrideTokens } from '../avatar-tokens'
import { surfaceDescriptionColor, surfaceFadedColor } from './shared'

export type ChatThreadHeaderState = ResolverState
export type ChatThreadHeaderConfig = HightideResolverConfig

export type ChatThreadHeaderTokens = AssertAssignable<{
  container: ResolvableContainerTokens<ChatThreadHeaderState, ChatThreadHeaderConfig>,
  contentRow: ResolvableContainerTokens<ChatThreadHeaderState, ChatThreadHeaderConfig>,
  title: ResolvableTextStyleTokens<ChatThreadHeaderState, ChatThreadHeaderConfig>,
  subtitle: ResolvableTextStyleTokens<ChatThreadHeaderState, ChatThreadHeaderConfig>,
}, ComponentTokens<ChatThreadHeaderState, ChatThreadHeaderConfig>> & {
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
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.surface.color')),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.padding.sm'), horizontal: TokenBuilder.numberRef('theme.padding.md') }),
    border: TokenBuilder.stateful({
      width: TokenBuilder.sides({ bottom: TokenBuilder.numberRef('theme.borderWidth.thin') }),
      color: TokenBuilder.sides({ bottom: surfaceFadedColor }),
    }),
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: TokenBuilder.numberRef('theme.spacing.xs'),
    }),
  },
  contentRow: {
    layout: TokenBuilder.stateful({
      direction: 'vertical',
      gap: TokenBuilder.numberRef('theme.spacing.xs'),
      flexGrow: TokenBuilder.number(1),
    }),
  },
  title: {
    kind: 'textStyle' as const,
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.bold')),
    color: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.surface.onColor')),
  },
  subtitle: {
    kind: 'textStyle' as const,
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.light')),
    color: TokenBuilder.stateful(surfaceDescriptionColor),
  },
  avatarOverride: {
    container: {
    kind: 'container' as const,
      size: TokenBuilder.stateful({
        width: threadAvatarSize,
        height: threadAvatarSize,
        minWidth: threadAvatarSize,
        minHeight: threadAvatarSize,
        maxWidth: threadAvatarSize,
        maxHeight: threadAvatarSize,
      }),
      borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.calc('divide', threadAvatarSize, TokenBuilder.number(2)) }),
    },
    icon: {
    kind: 'icon' as const,
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
    kind: 'container' as const,
      size: TokenBuilder.stateful({
        minHeight: TokenBuilder.number(0),
      }),
      padding: TokenBuilder.padding({ value: TokenBuilder.numberRef('theme.padding.md') }),
      layout: TokenBuilder.stateful({
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        gap: TokenBuilder.numberRef('theme.spacing.md'),
        flexGrow: TokenBuilder.number(1),
      }),
    },
  },
} as const
