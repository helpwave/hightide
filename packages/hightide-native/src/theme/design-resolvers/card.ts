import {
  cardTokens,
  type CardTokenResolver,
  type CardTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '@helpwave/hightide-design/component-tokens'

export const cardTokenResolver: CardTokenResolver = ({ themeTokens }) => (
  resolveConfigNode<CardTokens>(
    cardTokens,
    {
      theme: themeTokens,
      state: new Set(),
    }
  )
)
