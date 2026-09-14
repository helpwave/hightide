import {
  iconTokens,
  type IconParams,
  type IconTokenResolver
} from '@helpwave/hightide-design/component-tokens'
import { resolveIconTokenConfig } from '@helpwave/hightide-design/component-tokens'

export const iconTokenResolver: IconTokenResolver = ({
  themeTokens,
  overrides,
}) => {
  const size = overrides.size ?? 'md'

  return resolveIconTokenConfig(
    iconTokens,
    {
      theme: themeTokens,
      params: {
        numbers: {
          iconSize: themeTokens.icongraphy.sizes[size],
        },
      } satisfies IconParams,
      state: new Set(),
    }
  )
}
