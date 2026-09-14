import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverConfig, NumberToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import {
  type InputComponentResolverProps,
  type InputConfig,
  type InputState,
  type InputTokenResolver,
  type InputTokens
} from './input-tokens'
import type { HightideTokenPathProvider } from './token-context'
import type { ComponentTokensNode } from '../component-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'

export const textareaVisibleLineCount = 5

export type TextareaState = InputState
export type TextareaConfig = InputConfig

export type TextareaComponentResolverProps = InputComponentResolverProps

export type TextareaTokens = InputTokens

export type TextareaTokenResolver = InputTokenResolver

export type TextareaOverlayTokens = AssertAssignable<
  ResolvableContainerTokens<TextareaState, TextareaConfig>,
  ComponentTokensNode<TextareaState, TextareaConfig>
>

export type TextareaOverlayParams = AssertAssignable<{
  numbers: {
    width: NumberToken,
    lineHeight: NumberToken,
  },
}, HightideResolverParams>
export type TextareaTokenContext = HightideTokenPathProvider<TextareaOverlayParams>

export const textareaContainerOverlayTokens = {
  kind: 'container' as const,
  size: TokenBuilder.stateful({
    width: TokenBuilder.numberRef<TextareaTokenContext>('params.numbers.width'),
    height: TokenBuilder.calc(
      'multiply',
      TokenBuilder.number(textareaVisibleLineCount),
      TokenBuilder.numberRef<TextareaTokenContext>('params.numbers.lineHeight')
    ),
  }),
  layout: TokenBuilder.stateful({
    crossAxisAlignment: 'start',
  }),
} as const
