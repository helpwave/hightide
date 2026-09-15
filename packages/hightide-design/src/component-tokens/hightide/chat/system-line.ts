import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, HightideResolverParams, ResolverState } from '../../../primitive-tokens'
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
    foreground: ColorValueToken,
  },
}, HightideResolverParams>
export type ChatSystemLineTokenContext = HightideTokenPathProvider<ChatSystemLineParams>

export const chatSystemLineTokens = {
  container: {
    type: 'container',
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('center'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
      selfCrossAxisAlignment: 'center',
      gap: TokenBuilder.numberRef<ChatSystemLineTokenContext>('theme.padding.md'),
    }),
  },
  text: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<ChatSystemLineTokenContext>('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<ChatSystemLineTokenContext>('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<ChatSystemLineTokenContext>('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<ChatSystemLineTokenContext>('theme.fontWeights.medium')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<ChatSystemLineTokenContext>('params.colors.foreground')),
  },
  icon: {
    type: 'icon',
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<ChatSystemLineTokenContext>('params.colors.foreground')),
  },
} as const
