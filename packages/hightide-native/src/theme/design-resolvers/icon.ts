import {
  iconTokens,
  type IconTokenResolver,
  type IconTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'

type IconParams = {
  size: number,
}

export const iconTokenResolver: IconTokenResolver = ({
  themeTokens,
  overrides,
}) => {
  const size = overrides.size ?? 'md'

  return resolveTokenConfig<IconTokens>(
    iconTokens,
    new Set(),
    {
      theme: themeTokens,
      params: {
        size: themeTokens.icongraphy.sizes[size],
      } satisfies IconParams,
    }
  )
}
