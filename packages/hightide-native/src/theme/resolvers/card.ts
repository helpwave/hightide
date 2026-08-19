import type {
  CardStyle,
  CardThemeResolvers
} from '../types/components/card'
import {
  createSimpleStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'

export const toCardThemeResolvers: ComponentThemeResolver<CardThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolveCard = () => componentTokens.card({
    themeTokens,
    semanticResolvers: semanticTokens,
  })

  return {
    container: createSimpleStyleResolver((): CardStyle => ({
      ...StyleAdapterUtils.container(resolveCard()),
      overflow: 'hidden',
    })),
  }
}
