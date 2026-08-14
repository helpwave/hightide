import type { IconSize } from '@helpwave/hightide-design/theme-tokens'

import type { IconThemeResolvers } from '../types/components/hightide'
import type { ComponentThemeResolver } from '../types/resolver'

const iconSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly IconSize[]

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
