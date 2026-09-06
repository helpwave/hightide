import {
  textareaContainerOverlayTokens,
  type InputTokens,
  type TextareaTokenResolver
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'
import { inputTokenResolver } from './input'

type TextareaOverlayParams = {
  width?: number | `${number}%`,
  lineHeight: number,
}

export const textareaTokenResolver: TextareaTokenResolver = (props) => {
  const input = inputTokenResolver(props)
  const overlay = resolveTokenConfig<Pick<InputTokens['container'], 'size' | 'layout'>>(
    textareaContainerOverlayTokens,
    new Set(),
    {
      theme: props.themeTokens,
      params: {
        width: input.container.size?.width ?? '100%',
        lineHeight: input.text.lineHeight ?? 16,
      } satisfies TextareaOverlayParams,
    }
  )

  return {
    ...input,
    container: {
      ...input.container,
      ...overlay,
      layout: {
        ...input.container.layout,
        ...overlay.layout,
      },
    },
  }
}
