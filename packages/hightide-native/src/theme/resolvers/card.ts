import { toContainerStyle } from '../adapters/container-adapter'
import type {
  CardStyle,
  CardThemeResolvers
} from '../types/components/card'
import {
  createSimpleStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

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
      ...toContainerStyle(resolveCard()),
      overflow: 'hidden',
    })),
  }
}
