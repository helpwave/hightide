import {
  searchBarTokens,
  type SearchBarTokenResolver,
  type SearchBarTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'
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
  const resolved = resolveTokenConfig<Omit<SearchBarTokens, 'input'>>(
    searchBarTokens,
    new Set(),
    {
      theme: themeTokens,
      params: {
        iconButtonSize: iconButtonLayout.size,
      } satisfies SearchBarParams,
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
