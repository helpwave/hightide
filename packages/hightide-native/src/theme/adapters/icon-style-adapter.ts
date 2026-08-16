import type { IconTokens } from '@helpwave/hightide-design/component-token-resolvers'

import type { IconStyle } from '../../icons'
import { defined } from './defined'

export const toIconStyle = (tokens: IconTokens): IconStyle => defined({
  color: tokens.color,
  size: tokens.size,
  strokeWidth: tokens.strokeWidth,
})
