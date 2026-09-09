import {
  type InputComponentResolverProps,
  type InputTokenResolver,
  type InputTokens
} from './input-tokens'
import {
  stateful,
  tokenCalc,
  createTokenVariable,
  tokenValue
} from './builders'
import type { ComponentTokenConfig } from './token-config'
import type { TokenContext } from './token-context'
import type { ContainerTokens } from './container-tokens'

export const textareaVisibleLineCount = 5

export type TextareaComponentResolverProps = InputComponentResolverProps

export type TextareaTokens = InputTokens

export type TextareaTokenResolver = InputTokenResolver

export type TextareaOverlayParams = {
  width: number,
  lineHeight: number,
}
export type TextareaTokenContext = TokenContext<TextareaOverlayParams>

const tokenVariable = createTokenVariable<TextareaOverlayParams>()

export const textareaContainerOverlayTokens = {
  size: stateful({
    width: tokenVariable('params.width'),
    height: tokenCalc(
      'multiply',
      tokenValue(textareaVisibleLineCount),
      tokenVariable('params.lineHeight')
    ),
  }),
  layout: stateful({
    crossAxisAlignment: 'start',
  }),
} as const satisfies ComponentTokenConfig<ContainerTokens, TextareaTokenContext>
