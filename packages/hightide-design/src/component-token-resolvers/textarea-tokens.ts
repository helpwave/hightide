import {
  inputTokenResolver,
  type InputComponentResolverProps,
  type InputTokenResolver,
  type InputTokens
} from './input-tokens'

export const textareaVisibleLineCount = 5

export type TextareaComponentResolverProps = InputComponentResolverProps

export type TextareaTokens = InputTokens

export type TextareaTokenResolver = InputTokenResolver

export const textareaTokenResolver: TextareaTokenResolver = (props) => {
  const input = inputTokenResolver(props)
  const lineHeight = input.text.lineHeight ?? 16

  return {
    ...input,
    container: {
      ...input.container,
      size: {
        width: input.container.size?.width,
        height: textareaVisibleLineCount * lineHeight,
      },
      layout: {
        ...input.container.layout,
        crossAxisAlignment: 'start'
      },
    },
  }
}
