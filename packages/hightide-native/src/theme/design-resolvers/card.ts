import {
  cardTokens,
  type CardTokenResolver,
  type CardTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'

export const cardTokenResolver: CardTokenResolver = ({ themeTokens }) => (
  resolveTokenConfig<CardTokens>(
    cardTokens,
    new Set(),
    {
      theme: themeTokens,
    }
  )
)
