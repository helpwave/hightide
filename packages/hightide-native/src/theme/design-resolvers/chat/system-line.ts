import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import {
  chatSystemLineTokens,
  type ChatSystemLineTokenResolver,
  type ChatSystemLineTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '../../static-resolve/resolve'
import { resolveAccentColoring } from './shared'

type ChatSystemLineParams = {
  accentForeground: ColorToken,
}

export const chatSystemLineTokenResolver: ChatSystemLineTokenResolver = ({
  themeTokens,
  overrides,
}) => {
  const { accentText } = resolveAccentColoring({
    themeTokens,
    color: overrides.color,
  })

  return resolveConfigNode<ChatSystemLineTokens>(
    chatSystemLineTokens,
    {
      theme: themeTokens,
      params: {
        accentForeground: accentText.foreground,
      } satisfies ChatSystemLineParams,
      state: new Set(),
    }
  )
}
