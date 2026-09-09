import {
  searchBarTokens,
  type SearchBarTokenResolver,
  type SearchBarTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '../static-resolve/resolve'
import { inputTokenResolver } from './input'

type SearchBarParams = {
  iconButtonSize: number,
}

export const searchBarTokenResolver: SearchBarTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const input = inputTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides,
    state,
  })
  const iconButtonLayout = semanticResolvers.controlLayout({
    themeTokens,
    size: 'sm',
  })
  const resolved = resolveConfigNode<Omit<SearchBarTokens, 'input'>>(
    searchBarTokens,
    {
      theme: themeTokens,
      params: {
        iconButtonSize: iconButtonLayout.size,
      } satisfies SearchBarParams,
      state: new Set(),
    }
  )

  return {
    ...resolved,
    input: {
      ...input,
      container: {
        ...input.container,
        outline: undefined,
        shadow: undefined,
      },
    },
  }
}
