import { iconSizes } from '@helpwave/hightide-design/theme-tokens'

import type { IconThemeResolvers } from '../types/components/hightide'
import type { ComponentThemeResolver } from '../types/resolver'

export const toIconThemeResolvers: ComponentThemeResolver<IconThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => (
  Object.fromEntries(
    iconSizes.map((size) => [
      size,
      componentTokens.icon({
        themeTokens,
        semanticResolvers: semanticTokens,
        overrides: { size },
      }),
    ])
  ) as IconThemeResolvers
)
