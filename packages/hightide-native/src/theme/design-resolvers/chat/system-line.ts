import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import {
  chatSystemLineTokens,
  type ChatSystemLineTokenResolver,
  type ChatSystemLineTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../../static-resolve/resolve'
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

  return resolveTokenConfig<ChatSystemLineTokens>(
    chatSystemLineTokens,
    new Set(),
    {
      theme: themeTokens,
      params: {
        accentForeground: accentText.foreground,
      } satisfies ChatSystemLineParams,
    }
  )
}
