import {
  iconTokens,
  type IconTokenResolver
} from '@helpwave/hightide-design/component-tokens'
import { resolveIconTokenConfig } from '../static-resolve/resolve'

type IconParams = {
  size: number,
}

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
        size: themeTokens.icongraphy.sizes[size],
      } satisfies IconParams,
      state: new Set(),
    }
  )
}
