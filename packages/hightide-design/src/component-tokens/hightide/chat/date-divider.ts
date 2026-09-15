import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'
import type { ResolvableTextStyleTokens } from '../../resolvable-text-style-tokens'
import {
  pillBorderRadius,
  surfaceDescriptionColor
} from './shared'

export type ChatDateDividerState = ResolverState
export type ChatDateDividerConfig = HightideResolverConfig

export type ChatDateDividerTokens = AssertAssignable<{
  container: ResolvableContainerTokens<ChatDateDividerState, ChatDateDividerConfig>,
  text: ResolvableTextStyleTokens<ChatDateDividerState, ChatDateDividerConfig>,
}, ComponentTokens<ChatDateDividerState, ChatDateDividerConfig>>

export type ChatDateDividerTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatDateDividerTokens
>

export const chatDateDividerTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.surface.color')),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberValue(TokenBuilder.number(pillBorderRadius)) }),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.spacing.sm'), horizontal: TokenBuilder.numberRef('theme.spacing.lg') }),
    layout: TokenBuilder.stateful({
      selfCrossAxisAlignment: 'center',
    }),
  },
  text: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.medium')),
    color: TokenBuilder.stateful(surfaceDescriptionColor),
  },
} as const
