import {
  cardTokens,
  type CardTokenResolver,
  type CardTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '../static-resolve/resolve'

export const cardTokenResolver: CardTokenResolver = ({ themeTokens }) => (
  resolveConfigNode<CardTokens>(
    cardTokens,
    {
      theme: themeTokens,
      state: new Set(),
    }
  )
)
