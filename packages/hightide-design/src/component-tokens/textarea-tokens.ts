import {
  type InputComponentResolverProps,
  type InputTokenResolver,
  type InputTokens
} from './input-tokens'
import {
  stateful,
  tokenCalc,
  tokenPath,
  tokenValue
} from './builders'

export const textareaVisibleLineCount = 5

export type TextareaComponentResolverProps = InputComponentResolverProps

export type TextareaTokens = InputTokens

export type TextareaTokenResolver = InputTokenResolver

export const textareaContainerOverlayTokens = {
  size: stateful({
    width: tokenPath('params.width'),
    height: tokenCalc(
      'multiply',
      tokenValue(textareaVisibleLineCount),
      tokenPath('params.lineHeight')
    ),
  }),
  layout: stateful({
    crossAxisAlignment: 'start',
  }),
} as const
