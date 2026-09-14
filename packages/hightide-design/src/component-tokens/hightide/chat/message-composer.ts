import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'
import type { ResolvableTextStyleTokens } from '../../resolvable-text-style-tokens'
import { surfaceDescriptionColor, surfaceFadedColor } from './shared'

export type ChatMessageComposerState = ResolverState
export type ChatMessageComposerConfig = HightideResolverConfig

export type ChatMessageComposerTokens = AssertAssignable<{
  container: ResolvableContainerTokens<ChatMessageComposerState, ChatMessageComposerConfig>,
  input: ResolvableContainerTokens<ChatMessageComposerState, ChatMessageComposerConfig>,
  text: ResolvableTextStyleTokens<ChatMessageComposerState, ChatMessageComposerConfig>,
  placeholder: ResolvableTextStyleTokens<ChatMessageComposerState, ChatMessageComposerConfig>,
}, ComponentTokens<ChatMessageComposerState, ChatMessageComposerConfig>>

export type ChatMessageComposerTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatMessageComposerTokens
>

const composerInputMaxHeight = TokenBuilder.calc(
  'max',
  TokenBuilder.numberRef('theme.size.md'),
  TokenBuilder.calc(
    'add',
    TokenBuilder.calc(
      'multiply',
      TokenBuilder.numberRef('theme.typography.body.md.lineHeight'),
      TokenBuilder.number(8)
    ),
    TokenBuilder.calc(
      'multiply',
      TokenBuilder.numberRef('theme.padding.md'),
      TokenBuilder.number(2)
    )
  )
)

export const chatMessageComposerTokens = {
  container: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.surface.color')),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.padding.xl'), horizontal: TokenBuilder.numberRef('theme.padding.xl') }),
    border: TokenBuilder.stateful({
      width: TokenBuilder.sides({ top: TokenBuilder.numberRef('theme.borderWidth.thin') }),
      color: TokenBuilder.sides({ top: surfaceFadedColor }),
    }),
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'end',
      selfCrossAxisAlignment: 'stretch',
      gap: TokenBuilder.numberRef('theme.spacing.md'),
    }),
  },
  input: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.surfaceVariant.color')),
    size: TokenBuilder.stateful({
      minHeight: TokenBuilder.numberRef('theme.size.md'),
      maxHeight: composerInputMaxHeight,
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef('theme.borderRadius.sm') }),
    padding: TokenBuilder.padding({ blockStart: TokenBuilder.numberRef('theme.padding.md'), blockEnd: TokenBuilder.numberRef('theme.padding.md'), inlineStart: TokenBuilder.calc(
        'add',
        TokenBuilder.numberRef('theme.padding.md'),
        TokenBuilder.numberRef('theme.spacing.md')
      ), inlineEnd: TokenBuilder.numberRef('theme.padding.md') }),
    layout: TokenBuilder.stateful({
      flexGrow: TokenBuilder.number(1),
      flexShrink: TokenBuilder.number(1),
    }),
  },
  text: {
    kind: 'textStyle' as const,
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.md.fontWeight')),
    color: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.surface.onColor')),
  },
  placeholder: {
    kind: 'textStyle' as const,
    color: TokenBuilder.stateful(surfaceDescriptionColor),
  },
} as const
