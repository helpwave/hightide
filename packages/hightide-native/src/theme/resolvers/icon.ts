import {
  componentSizes,
  type ComponentSize
} from '@helpwave/hightide-design/semantic-token-resolvers'

import type { IconThemeResolvers } from '../types/components/hightide'
import type { ComponentThemeResolver } from '../types/resolver'

export const toIconThemeResolvers: ComponentThemeResolver<IconThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => (
  Object.fromEntries(
    componentSizes.map((size: ComponentSize) => [
      size,
      componentTokens.icon({
        themeTokens,
        semanticResolvers: semanticTokens,
        overrides: { size },
      }),
    ])
  ) as IconThemeResolvers
)
