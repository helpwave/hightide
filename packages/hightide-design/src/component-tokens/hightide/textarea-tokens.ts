import { TokenBuilder } from '../../utils'
import type { AssertAssignable, NumberValueToken, HightideResolverParams } from '../../primitive-tokens'
import {
  type InputComponentResolverProps,
  type InputConfig,
  type InputState,
  type InputTokenResolver,
  type InputTokens
} from './input-tokens'
import type { HightideTokenPathProvider } from './token-context'
import type { ComponentTokensNode } from '../component-tokens'
import type { ContainerTokens } from '../container-tokens'

export const textareaVisibleLineCount = 5

export type TextareaState = InputState
export type TextareaConfig = InputConfig

export type TextareaComponentResolverProps = InputComponentResolverProps

export type TextareaTokens = InputTokens

export type TextareaTokenResolver = InputTokenResolver

export type TextareaOverlayTokens = AssertAssignable<
  ContainerTokens,
  ComponentTokensNode<TextareaConfig>
>

export type TextareaOverlayParams = AssertAssignable<{
  numbers: {
    width: NumberValueToken,
    lineHeight: NumberValueToken,
  },
}, HightideResolverParams>
export type TextareaTokenContext = HightideTokenPathProvider<TextareaOverlayParams>

export const textareaContainerOverlayTokens = {
  type: 'container',
  size: TokenBuilder.stateful({
    width: TokenBuilder.numberRef<TextareaTokenContext>('params.numbers.width'),
    height: TokenBuilder.calc(
      'multiply',
      TokenBuilder.numberValue(TokenBuilder.number(textareaVisibleLineCount)),
      TokenBuilder.numberRef<TextareaTokenContext>('params.numbers.lineHeight')
    ),
  }),
  layout: TokenBuilder.stateful({
    crossAxisAlignment: TokenBuilder.crossAxisAlignment('start'),
  }),
} as const
