import type { TextStyle, ViewStyle } from 'react-native'

import type { ContainerTokens } from '@helpwave/hightide-design/component-token-resolvers'
import type { TextStyleTokens } from '@helpwave/hightide-design/component-token-resolvers'

export const toContainerStyle = (tokens: ContainerTokens): ViewStyle => ({
  flexDirection: tokens.flexDirection,
  alignItems: tokens.alignItems,
  justifyContent: tokens.justifyContent,
  backgroundColor: tokens.backgroundColor,
  borderColor: tokens.borderColor,
  borderWidth: tokens.borderWidth,
  borderRadius: tokens.borderRadius,
  paddingVertical: tokens.paddingVertical,
  paddingHorizontal: tokens.paddingHorizontal,
  gap: tokens.gap,
  minWidth: tokens.minWidth,
  minHeight: tokens.minHeight,
  opacity: tokens.opacity,
})

export const toTextStyle = (tokens: TextStyleTokens): TextStyle => ({
  color: tokens.color,
  fontSize: tokens.fontSize,
  fontWeight: tokens.fontWeight,
  fontFamily: tokens.fontFamily,
  lineHeight: tokens.lineHeight,
})
