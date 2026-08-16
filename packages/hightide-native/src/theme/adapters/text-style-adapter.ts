import type { TextStyle } from 'react-native'

import type { TextStyleTokens } from '@helpwave/hightide-design/component-token-resolvers'

import { defined } from './defined'

export const toTextStyle = (tokens: TextStyleTokens): TextStyle => defined({
  color: tokens.color,
  fontSize: tokens.fontSize,
  fontWeight: tokens.fontWeight,
  fontFamily: tokens.fontFamily,
  lineHeight: tokens.lineHeight,
  textAlign: tokens.textAlign,
  flex: tokens.flex,
  flexShrink: tokens.flexShrink,
})
