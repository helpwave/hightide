import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, ColorToken, HightideResolverConfig, HightideResolverParams, ResolverState } from '../../../primitive-tokens'
import type { ColorPairToken } from '../../../theme-tokens/create'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../../resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from '../../resolvable-text-style-tokens'
import type { HightideTokenPathProvider } from '../token-context'

export type ChatSystemLineState = ResolverState
export type ChatSystemLineConfig = HightideResolverConfig

export type ChatSystemLineComponentResolverProps = {
  overrides: {
    color?: ColorPairToken,
  },
}

export type ChatSystemLineTokens = AssertAssignable<{
  container: ResolvableContainerTokens<ChatSystemLineState, ChatSystemLineConfig>,
  text: ResolvableTextStyleTokens<ChatSystemLineState, ChatSystemLineConfig>,
  icon: ResolvableIconTokens<ChatSystemLineState, ChatSystemLineConfig>,
}, ComponentTokens<ChatSystemLineState, ChatSystemLineConfig>>

export type ChatSystemLineTokenResolver = ComponentTokenResolver<
  ChatSystemLineComponentResolverProps,
  ChatSystemLineTokens
>

export type ChatSystemLineParams = AssertAssignable<{
  colors: {
    foreground: ColorToken,
  },
}, HightideResolverParams>
export type ChatSystemLineTokenContext = HightideTokenPathProvider<ChatSystemLineParams>

export const chatSystemLineTokens = {
  container: {
    kind: 'container' as const,
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      selfCrossAxisAlignment: 'center',
      gap: TokenBuilder.numberRef<ChatSystemLineTokenContext>('theme.padding.md'),
    }),
  },
  text: {
    kind: 'textStyle' as const,
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<ChatSystemLineTokenContext>('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<ChatSystemLineTokenContext>('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<ChatSystemLineTokenContext>('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<ChatSystemLineTokenContext>('theme.fontWeights.medium')),
    color: TokenBuilder.stateful(TokenBuilder.colorRef<ChatSystemLineTokenContext>('params.colors.foreground')),
  },
  icon: {
    kind: 'icon' as const,
    color: TokenBuilder.stateful(TokenBuilder.colorRef<ChatSystemLineTokenContext>('params.colors.foreground')),
  },
} as const
